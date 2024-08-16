import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
    {
        fromUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        toInstitute: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
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
            enum: ["SUCCESS", "FAILED", "PENDING"],
            required: true,
        },
    },
    {
        timestamps: true
    }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);