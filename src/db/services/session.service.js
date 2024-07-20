import { Course } from "../../models/course.model.js";
import { Session } from "../../models/session.model.js";
import mongoose from "mongoose";


const getSessionAndCourse = async (sessionId) => {
    const session = await Session.aggregate(
        [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId( sessionId),
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
    console.log(sessions);
    return sessions;
}

const SessionService = {
    getSessionAndCourse,
    getByInstitute,
}

export { SessionService }