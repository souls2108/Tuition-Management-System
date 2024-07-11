import mongoose from "mongoose";

const instituteSchema = new Schema(
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
    },
    {
        timestamps: true,
    }
);



export const Institute = mongoose.model("Institute", instituteSchema);