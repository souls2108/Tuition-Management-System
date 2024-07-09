import mongoose from "mongoose";

const courseSchema = new mongoose.Model(
    {
        subject: {
            type: String,
            required: true,            
        },
        class: {
            type: String,
            required: true
        },
        offeredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute"
        },
        visible: {
            type: String,
            enum: ["PUBLIC", "PRIVATE"],
            default: "PUBLIC",
        },
        description: {
            type: String,
            default: "_",
        }
    },
    {
        timestamps: true,
    }
);



export const Institute = mongoose.model("Institute", instituteSchema);