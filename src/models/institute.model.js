import { Schema } from "mongoose";
import mongoose from "mongoose";

const instituteSchema = new Schema(
    {
        instituteName: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true
        },
        founder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },
    {
        timestamps: true,
    }
);



export const Institute = mongoose.model("Institute", instituteSchema);