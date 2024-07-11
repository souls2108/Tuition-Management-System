import { Schema } from "mongoose";


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
            enum: ["ADMIN", "STAFF"],
            required: true
        }
    }
)