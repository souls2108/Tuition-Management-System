import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,            
        },
        startAt: {
            type: Date,
            required: true
        },
        endAt: {
            type: Date,
        },
        fees: {
            type: Number,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    },
    {
        timestamps: true,
    }
);



export const Session = mongoose.model("Session", sessionSchema);