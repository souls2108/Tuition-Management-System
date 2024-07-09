import mongoose, { Schema }  from "mongoose";

const orderSchema = new Schema(
    {
        transaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction"
        },
        amount: {
            type: Number,
            required: true,
        },
        states: {
            type: String,
            enum: ["PENDING", "CANCELLED", "COMPLETED"],
            default: "PENDING",
        }
    },
    {
        timestamps: true
    }
);

export const Order = mongoose.model("Order", orderSchema);