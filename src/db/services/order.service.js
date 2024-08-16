import mongoose from "mongoose";
import { Order } from "../../models/order.model.js";

const getBySessionId = async (sessionId, pendingOrdersOnly) => {
    let pipeline = [];
    if(pendingOrdersOnly) {
        pipeline.push(
            {
                $match: {
                    state: "PENDING"
                }
            }
        )
    }

    pipeline.push(
        {
            $lookup: {
                from: "enrollments",
                localField: "enrollment",
                foreignField: "_id",
                as: "enrollment"
            }
        },
        {
            $match: {
                'enrollment.session': mongoose.Types.ObjectId(sessionId), 
            }
        }
    )

    const orders = await Order.aggregate(
        pipeline
    )

    return orders
}

const getByInstituteId = async (instituteId, pendingOrdersOnly) => {
    let pipeline = [];
    if(pendingOrdersOnly) {
        pipeline.push(
            {
                $match: {
                    state: "PENDING"
                }
            }
        )
    }

    pipeline.push(
        {
            $lookup: {
                from: "enrollments",
                localField: "enrollment",
                foreignField: "_id",
                as: "enrollment"
            }
        },
        {
            $lookup: {
                from: "sessions",
                localField: 'enrollment.session',
                foreignField: '_id',
                as: 'enrollment.session'
            }
        },
        {
            $lookup: {
                from: "course",
                localField: "enrollment.session.course",
                foreignField: "_id",
                as: "enrollment.session.course"
            }
        },
        {
            $match: {
                'enrollment.session.course.institute': mongoose.Types.ObjectId(instituteId) 
            }
        }
    );

    const orders = await Order.aggregate(
        pipeline
    );

    return orders;
}

const getByUserId = async (userId, pendingOrdersOnly) => {
    let pipeline = [];
    if(pendingOrdersOnly) {
        pipeline.push(
            {
                $match: {
                    state: "PENDING"
                }
            }
        )
    }
    
    pipeline.push(
        {
            $lookup: {
                from: "enrollments",
                localField: "enrollment",
                foreignField: "_id",
                as: "enrollment"
            }
        },
        {
            $match: {
                'enrollment.student': mongoose.Types.ObjectId(userId)
            }
        }
    )

    const orders = await Order.aggregate(
        pipeline
    );

    return orders;
}

const getById = async(orderId) => {
    return await Order.findById(orderId);
}

const createMany = async (enrollmentIds, amount) => {

    const orderCreated = enrollmentIds.map((enrollmentId) => {
        return {
            enrollment: enrollmentId,
            amount: amount
        }
    })

    const orders = await Order.insertMany(orderCreated);
    
    return orders;
}

const updateAmountById = async(orderId, amount) => {
    return await Order.findByIdAndUpdate(
        orderId,
        {
            $set: {
                amount,
            }
        },
        {new: true}
    )
}

const deleteById = async(orderId) => {
    return await Order.findByIdAndDelete(orderId);
}

//TODO: complete order called by createTransaction controller

const OrderService = {
    getBySessionId,
    getByInstituteId,
    getByUserId,
    getById,
    createMany,
    updateAmountById,
    deleteById,
}

export { OrderService }