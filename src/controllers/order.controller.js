import { EnrollmentService } from "../db/services/enrollment.service.js";
import { OrderService } from "../db/services/order.service.js";
import { SessionService } from "../db/services/session.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const verifyHandleSessionPermission = async (loggedInEmp, sessionId) => {
    //XXX: move constants
    const permission = ["OWNER", "ADMIN", "TEACHER"]
    if(!loggedInEmp || permission.includes(loggedInEmp.role)) {
        throw new ApiError(403, "Not sufficient permission to perform action");
    }

    if(!sessionId) return;
    
    const session = await SessionService
        .getSessionAndCourse(sessionId);
    if(!session || !session.course.institute) {
        throw new ApiError(404, "Session or Course not found");
    }
    if( !session.course.institute.equals(loggedInEmp.institute)) {
        throw new ApiError(403, "Course does not belong to institute")
    };
}

const getOrdersInstitute = asyncHandler(async (req, res) => {
    const {sessionId, pendingOrdersOnly = true} = req.body;
    const instituteId = req.emp?.institute;
    
    if(!sessionId && !instituteId) {
        throw new ApiError(400, "sessionId, or instituteId is required");
    }
    
    let orders;
    if (sessionId) {
        await verifyHandleSessionPermission(req.emp, sessionId);
        orders = await OrderService.getBySessionId(sessionId, pendingOrdersOnly);
    } else {
        await verifyHandleSessionPermission(req.emp);
        if( !instituteId.equals( req.emp.institute)) {
            throw ApiError(403, "unauthorized access to institute");
        }
        orders = await OrderService.getByInstituteId(instituteId, pendingOrdersOnly);
    }

    return res.status(200).json(new ApiResponse(200, orders, "Orders fetched"));
});

const getOrdersUser = asyncHandler(async (req, res) => {
    const orders = await OrderService.getByUserId(req.user);
    return res.status(200).json(new ApiResponse(200, orders, "orders fetched"));
});

const createOrder = asyncHandler(async (req, res) => {
    const {sessionId, amount, enrollmentIds} = req.body;

    if(amount < 0) {
        throw new ApiError(400, "Amount cannot be negative");
    }

    await verifyHandleSessionPermission(req.emp, sessionId);

    const sessionEnrollmentIds = (await EnrollmentService.getActiveIdsBySessionId(sessionId)).map((enrollment) => enrollment._id.toString());
    const sessionEnrollmentSet = Set(sessionEnrollmentIds);

    const invalidEnrollment = enrollmentIds.find((enrollment) => !sessionEnrollmentSet.has(enrollment))
    if(invalidEnrollment) {
        throw new ApiError(409, `Enrollment ${invalidEnrollment} not registered to session`);
    }

    const orders = await OrderService.createMany(enrollmentIds, amount);

    return res.status(201).json(new ApiResponse(201, orders, "Orders created"))
});

const updateOrderAmount = asyncHandler(async (req, res) => {
    const { orderId, amount } = req.body;
    if(!orderId || !amount) {
        throw new ApiError(400, "OrderId is required");
    }
    if(amount < 0) {
        throw new ApiError(400, "amount cannot be negative")
    }

    const order = await OrderService.getById(orderId);
    if(!order) {
        throw new ApiError(404, "order not found");
    }

    const enrollment = await EnrollmentService.getById(order.enrollment);
    await verifyHandleSessionPermission(req.emp, enrollment.session);

    const newOrder = await OrderService.updateAmountById(order._id, amount);
    
    return res.status(200).json(new ApiResponse(200, newOrder, "Order updated"));
});

const deleteOrder = asyncHandler( async (req, res) => {
    const { orderId } = req.body;
    if(!orderId) {
        throw new ApiError(400, "OrderId is required");
    }

    const order = await OrderService.getById(orderId);
    if(!order) {
        throw new ApiError(404, "order not found");
    }

    const enrollment = await EnrollmentService.getById(order.enrollment);
    await verifyHandleSessionPermission(req.emp, enrollment.session);

    await OrderService.deleteById(orderId);

    return res.status(204).json(new ApiResponse(204, {}, "Order deleted"));
})

export {
    getOrdersInstitute,
    getOrdersUser,
    createOrder,
    updateOrderAmount,
    deleteOrder,
}