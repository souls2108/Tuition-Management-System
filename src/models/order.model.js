import mongoose, { Schema }  from "mongoose";

const orderSchema = new Schema(
    {
        enrollment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Enrollment",
            required: true,
        },
        transaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction"
        },
        amount: {
            type: Number,
            required: true,
        },
        state: {
            type: String,
            enum: ["PENDING", "COMPLETED"],
            default: "PENDING",
        }
    },
    {
        timestamps: true
    }
);

export const Order = mongoose.model("Order", orderSchema);