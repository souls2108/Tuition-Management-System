import mongoose from "mongoose";

const sessionSchema = new mongoose.Model(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: true,
            required: true,            
        },
        startAt: {
            type: Date,
            required: true
        },
        endAt: {
            type: Date,
            required: true
        },
        fees: {
            type: Number,
            required: true
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true,
    }
);



export const Session = mongoose.model("Session", sessionSchema);