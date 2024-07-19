import { EmployeeServices } from "../db/services/employee.service";
import { Session } from "../models/session.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";


const verifyHandleSessionPermission = async (loggedInEmp, sessionId) => {
    //XXX: move constants
    const permission = ["OWNER", "ADMIN"]
    if(!loggedInEmp || permission.includes(loggedInEmp)) {
        throw new ApiError(403, "Not sufficient permission to perform action");
    }

    if(!sessionId) return;
    
    const session = await Session.aggregate(
        [
            {
                $match: {
                    _id: sessionId
                }
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "course",
                    foreignField: "_id",
                    as: "course"
                }
            },
            {
                $unwind: "$course"
            }
        ]
    )
    if(!session) {
        throw new ApiError(404, "Course not found");
    }
    if( !session.course.institute.equals(loggedInEmp.institute)) {
        throw new ApiError(409, "Course does not belong to institute")
    };
}


const getAllSessions = asyncHandler( async (req, res) => {
    const { courseId, isActive } = req.body;

    if(!courseId) {
        throw new ApiError(400, "courseId field is required");
    }

    const query = {course: courseId};
    if(isActive) {
        query.isActive = true
    }
    const sessions = await Session.find(
        query
    );

    if(!sessions.length) {
        return res.status(200).json(new ApiResponse(200, {}, "No sessions for course."));
    }
    return res.status(200).json(new ApiResponse(200, { sessions }, "Sessions fetched for course."));
});

const createSession = asyncHandler(async (req, res) => {
    await verifyHandleSessionPermission(req.emp);

    const { courseId, startAt, endAt, fees,  isActive, instructor} = req.body;
    if (!courseId) {
        throw new ApiError(400, "courseId field is required");
    }
    if (!fees) {
        throw new ApiError(400, "fees field is required");
    }
    if(startAt && endAt && Date(endAt) < Date(startAt)) {
        throw new ApiError(409, "endDate cannot be before startDate")
    }

    const doc = {
        course: courseId,
        startAt: startAt || Date.now(),
        endAt,
        fees,
        isActive,
    }
    const existInstructor = await EmployeeServices.getById(instructor)
    if(existInstructor) {
        doc.instructor = instructor;
    }

    const session = await Session.create(doc);

    return res.status(201).json(new ApiResponse(201, session, "Session created"));
});

const updateSession = asyncHandler( async (req, res) => {
    const {sessionId, courseId, startAt, endAt, fees, isActive, instructor} = req.body;
    if(!sessionId) {
        throw new ApiError(400, "sessionId is required");
    }
    if(!courseId || !startAt || !endAt || !fees) {
        throw new ApiError(400, "courseId, startAt, endAt, fees are required");
    }

    await verifyHandleSessionPermission(req.emp, sessionId);

    const session = await Session.findByIdAndUpdate(
        sessionId,
        {
            $set:{
                course: courseId,
                startAt,
                endAt,
                fees,
                isActive,
                instructor,
            },
        },
        {new: true}
    );

    return res.status(200).json(new ApiResponse(200, session, "Session details updated"));
});

const deleteSession =  asyncHandler( async (req, res) => {
    const {sessionId} = req.body;

    await verifyHandleSessionPermission(req.emp, sessionId);

    await Session.findByIdAndDelete(sessionId);

    return res.status(204).json(new ApiResponse(204, {}, "Course deleted"))
});

export {
    createSession,
    getAllSessions,
    updateSession,
    deleteSession
}