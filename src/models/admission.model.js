import mongoose, { Schema } from "mongoose";


const admissionSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        institute: {
            type: Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Admission = mongoose.model("Admission", admissionSchema);