import mongoose from "mongoose";

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
        startAt: {
            type: Date,
            required: true
        },
        endAt: {
            type: Date,
        },
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            }
        ],
    },
    {
        timestamps: true,
    }
);



export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);