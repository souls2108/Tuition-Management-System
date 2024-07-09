import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
    {
        fromUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        toUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ["CASH", "ONLINE"],
            default: "CASH"
        },
        state: {
            type: String,
            enum: ["SUCCESS", "FAILED", "PENDING"]
        },
    },
    {
        timestamps: true
    }
);

export const Transaction = mongoose.Model("Transaction", transactionSchema);