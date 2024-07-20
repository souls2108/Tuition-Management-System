import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        subject: {
            type: String,
            required: true,            
        },
        grade: {
            type: String,
            required: true,
        },
        institute: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        description: {
            type: String,
            default: "",
            maxLength: 40,
        }
    },
    {
        timestamps: true,
    }
);



export const Course = mongoose.model("Course", courseSchema);