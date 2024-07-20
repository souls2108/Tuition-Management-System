import { Course } from "../../models/course.model.js";
import { EnrollmentRequest } from "../../models/userEnrollmentRequest.model.js";


const get = async (userId, sessionId) => {
    const enrollRequest = await EnrollmentRequest.findOne(
        {user:userId, session: sessionId}
    );
    return enrollRequest;
}

const getById = async ( requestId) => {
    const enrollRequest = await EnrollmentRequest.findById(requestId);
    return enrollRequest;
}

const getByInstituteId = async (instituteId) => {
    const courseSessionRequests = await Course.aggregate(
        [
            {
                $match: {
                    institute: instituteId,
                }
            },
            {
                $lookup: {
                    from: "sessions",
                    localField: '_id',
                    foreignField: 'course',
                    as: 'sessions'
                }
            },
            {
                $unwind: "$sessions"
            },
            {
                $project: {
                    _id: 0,
                    courseDetails: {
                        courseId: "$_id",
                        subject: "$subject",
                        grade: "$grade",
                        courseIsActive: "$isActive",
                        description: "$description",
                        sessionId: "$sessions._id",
                        fees: "$sessions.fees",
                    },
                }
            },
            {
                $lookup: {
                    from: 'enrollmentrequests',
                    localField: 'courseDetails.sessionId',
                    foreignField: 'session',
                    as: 'enrollRequest'

                }
            },
            {
                $unwind: "$enrollRequest"
            },
            {
                $project: {
                    courseDetails: 1,
                    user: "$enrollRequest.user",
                    enrollRequest: {
                        requestId: "$enrollRequest._id",
                        userStatus: "$enrollRequest.userStatus",
                        instituteStatus: "$enrollRequest.instituteStatus"
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    courseDetails: 1,
                    enrollRequest: 1,
                    user: {
                        userId: "$user._id",
                        displayName: "$user.displayName",
                        email: "$user.email"
                    }
                }
            }
        ]
    );

    return courseSessionRequests;
}



const EnrollmentRequestService = {
    get,
    getById,
    getByInstituteId,
}

export {EnrollmentRequestService};