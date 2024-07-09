import mongoose from "mongoose";

const instituteSchema = new mongoose.Model(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        admin: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
    },
    {
        timestamps: true,
    }
);



export const Institute = mongoose.model("Institute", instituteSchema);