import mongoose, { Schema } from "mongoose";


const examSchema = new Schema(
    {
        session: {
            type: Schema.Types.ObjectId,
            ref: "Session",
            required: true,
        },
        examName: {
            type: String,
            required: true,
        },
        topics: {
            type: [String],
            default: [],
        },
        time: {
           type: Date,
           required: true, 
        },
        fullMarks: {
            type: Number,
            required: true,
        },
    }
);


export const Exam = mongoose.model("Exam", examSchema);
