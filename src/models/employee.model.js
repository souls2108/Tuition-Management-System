import mongoose from "mongoose";
import { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const employeeSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        institute: {
            type: Schema.Types.ObjectId,
            ref: "Institute",
            required: true
        },
        role: {
            type: String,
            enum: ["OWNER", "ADMIN", "TEACHER"],
            required: true
        }
    }
);

employeeSchema.plugin(aggregatePaginate);

// employeeSchema.methods.generateToken = function () {
//     return jwt.sign(
//         {
//             _id: this._id
//         },
//         process.env.EMP_ACCESS_TOKEN_SECRET,
//         {
//             expiresIn: process.env.EMP_ACCESS_TOKEN_EXPIRY
//         }
//     );
// }

export const Employee = mongoose.model("Employee", employeeSchema);