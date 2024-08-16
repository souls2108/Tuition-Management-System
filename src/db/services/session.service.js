import { Course } from "../../models/course.model.js";
import { Session } from "../../models/session.model.js";
import Schema from "mongoose";

const getSessionAndCourse = async (sessionId) => {
    const session = await Session.aggregate(
        [
            {
                $match: {
                    _id: new Schema.Types.ObjectId( sessionId),
                },
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
    );
    if (!session.length) {
        return;
    }
    return session[0];
}

const getById = async(sessionId) => {
    const session = await Session.findById(sessionId);
    return session;
}

const getByInstitute = async (instituteId, isActiveOnly) => {
    const sessions = await Course.aggregate([
        {
            $match: {
                institute: instituteId
            }
        },
        {
            $project: {
                subject: 1
            }
        }
    ])

    return sessions;
}

const SessionService = {
    getSessionAndCourse,
    getByInstitute,
    getById
}

export { SessionService }