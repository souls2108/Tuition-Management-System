import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

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

admissionSchema.plugin(aggregatePaginate)

export const Admission = mongoose.model("Admission", admissionSchema);