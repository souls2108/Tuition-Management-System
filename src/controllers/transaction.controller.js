import { EnrollmentService } from "../db/services/enrollment.service.js";
import { OrderService } from "../db/services/order.service.js";
import { SessionService } from "../db/services/session.service.js";
import { Transaction } from "../models/transction.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyHandleTransactionPermission = async (emp) => {
    if(!emp) {
        throw new ApiError(401, "employee login required");
    }
    if(!["OWNER", "ADMIN"].includes(emp.role)) {
        throw new ApiError(403, "action not permitted");
    }
}

const createTransaction = asyncHandler(async (req, res) => {
    const {orderId, paymentMethod} = req.body;

    if(!orderId || !paymentMethod) {
        throw new ApiError(400, "orderId & paymentMethod are required.");
    }
    if(!req.user) {
        throw new ApiError(401, "user login required");
    }

    const order = await OrderService.getById(orderId);
    if(!order) {
        throw new ApiError(404, "order not found");
    }
    if(order.state.equals("COMPLETED")) {
        throw new ApiError(409, "order already completed");
    }

    const enrollment = await EnrollmentService.getById(order.enrollment);
    if(!enrollment) {
        throw new ApiError(404, "enrollment not found");
    }
    if(!enrollment.student.equals(req.user._id)) {
        throw new ApiError(404, "order not found");
    }
    const instituteId = (await SessionService.getSessionAndCourse()).course.institute;
    if(!instituteId) {
        throw new ApiError("institute not found");
    }
    
    const transaction = await Transaction.create({
        fromUser: req.user,
        toInstitute: instituteId,
        amount: order.amount,
        paymentMethod,
        state: "PENDING",
    });

    return res.status(201).json(new ApiResponse(201, transaction, "transaction created"));
});

const getUserTransactions = asyncHandler(async (req, res) => {
    if(!req.user) {
        throw new ApiError(401, "user login required");
    }

    const transactions = await Transaction.find({fromUser: req.user});
    return res.status(200).json(new ApiResponse(200, transactions, "user transactions fetched"));
});

const getInstituteTransactions = asyncHandler(async (req, res) => {
    await verifyHandleTransactionPermission(req.emp);

    const transactions = await Transaction.find({toInstitute: req.emp.institute});
    return res.status(200).json(new ApiResponse(200, transactions, "user transactions fetched"));
});

// const updateTransactionState = asyncHandler(async (req, res) => {
//     const {orderId, transactionId, state} = req.body;
//     if(!state) {
//         throw new ApiError(400, "transaction state is required");
//     }

//     const transaction = await Transaction.findByIdAndUpdate(transactionId, {$set: {state}}, {new: true});
//     if(!transaction) {
//         throw new ApiError(404, "transaction not found");
//     }
//     if(transaction.state === "SUCCESS") {

//     }
// });

export {
    createTransaction,
    getUserTransactions,
    getInstituteTransactions,
}