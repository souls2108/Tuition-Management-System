import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userRoleSchema = new Schema(
    {
        institute: {
            type: Schema.Types.ObjectId,
            ref: Institute,
            required: true,
        },
        role: {
            type: String,
            enum: ["OWNER", "ADMIN", "TEACHER", "STUDENT"],
            required: true,
        }
    }
)

const userSchema = new Schema(
    {
        displayName: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            unique: true,
            validate: {
                validator: validatePhone,
                message: 'Phone number must contain only digits (0-9)'
            }
        },
        roles: {
            type: [userRoleSchema],
            default: []
        },
        password: {
            type: String,
            required: [true, "password is required"]
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

const validatePhone = function(value) {
    // Regular expression to match only digits (0-9)
    const phoneRegExp = '/^\d+$/';
    return phoneRegExp.test(value);
};

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.Model("User", userSchema); 