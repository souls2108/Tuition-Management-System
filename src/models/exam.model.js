import mongoose, { Schema } from "mongoose";


const examSchema = new Schema(
    {
        enrollment: {
            type: Schema.Types.ObjectId,
            ref: "Enrollment",
            required: true,
        },
        examName: {
            type: String,
            required: true,
        },
        time: {
           type: Date,
           required: true, 
        },
        marksScored: {
            type: Number,
            default: 0,
            validate: {
                validator: function() {
                    return this.marksScored <= this.fullMarks;
                },
                message: 'Marks scored should be less or equal to full marks'
            }
        },
        fullMarks: {
            type: Number,
            required: true,
        },
        remark: {
            type: String,
            default: "",
            maxLength: 40,
        }
    }
);


export const Exam = mongoose.model("Exam", examSchema);
