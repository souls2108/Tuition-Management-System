import mongoose, { Schema } from "mongoose";


const userInstituteRequestSchema = new Schema(
    {
        institute: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        roleType: {
            type: String,
            enum: ["OWNER", "ADMIN", "TEACHER", "STUDENT"],
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
    },
    {
        timestamps: true,
    }
);


export const UserInstituteRequest = mongoose.model(
    "UserInstituteRequest", userInstituteRequestSchema
);