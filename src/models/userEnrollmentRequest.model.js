import mongoose, { Schema } from "mongoose";


const enrollmentRequestSchema = new Schema(
    {
        session: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userStatus: {
            type: String,
            enum: ["ACCEPT", "REJECT", "PENDING"],
            default: "PENDING",
        },
        instituteStatus: {
            type: String,
            enum: ["ACCEPT", "REJECT", "PENDING"],
            default: "PENDING",
        },
        // expireAt: {
        //     type: Date,
        //     required: true,
        //     index: { expireAfterSeconds: 0}
        // }
    },
    {
        timestamps: true,
    }
);

// TODO : Auto delete when { accept / reject }

export const EnrollmentRequest = mongoose.model(
    "EnrollmentRequest", enrollmentRequestSchema
);