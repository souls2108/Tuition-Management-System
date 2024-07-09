import mongoose, { Schema } from "mongoose";


const attendanceSchema = new Schema(
    {
        enrollment: {
            type: Schema.Types.ObjectId,
            ref: "Enrollment",
            required: true
        },
        start: {
            type: Date,
            required: true
        },
        duration: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["PRESENT", "ABSENT", "NA"],
            default: "NA"
        },
    },
    {
        timestamps: true
    }
);

export const Attendance = mongoose.Model("Attendance", attendanceSchema);