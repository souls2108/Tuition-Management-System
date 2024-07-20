import mongoose from "mongoose";
import { Schema } from "mongoose";


const enrollmentSchema = new Schema(
    {
        session: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: true,            
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
    }
);



export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);