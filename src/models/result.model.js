import mongoose, { Schema } from "mongoose";


const resultSchema = new Schema(
    {
        enrollment: {
            type: Schema.Types.ObjectId,
            ref: "Enrollment",
            required: true,
        },
        exam: {
            type: Schema.Types.ObjectId,
            ref: "Exam",
            required: true,
        },
        marksScored: {
            type: Number,
            default: 0,
        },
    }
);


export const Result = mongoose.model("Result", resultSchema); 