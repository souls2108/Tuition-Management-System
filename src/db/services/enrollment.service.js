import { Enrollment } from "../../models/enrollment.model.js";


const create = async (sessionId, studentId ) => {
    const enrollment = await Enrollment.create({
        session: sessionId,
        student: studentId,
    });
    return enrollment;
}

const get = async (userId, sessionId) => {
    const enrollment = await Enrollment.findOne({user: userId, session: sessionId});
    return enrollment;
}

const getById = async(enrollId) => {
    const enrollment = await Enrollment.findById(enrollId);
    return enrollment;
}

const getByUserId = async(userId) => {
    const enrollments = await Enrollment.find({student: userId});
    return enrollments;
} 

const getActiveBySessionId = async (sessionId) => {
    const enrollments = await Enrollment.find(
        {session: sessionId, isActive: true}
    );
    return enrollments;
}

const getActiveIdsBySessionId = async (sessionId) => {
    const enrollmentIds = await Enrollment.find(
        {session: sessionId, isActive: true},
        {_id:1}
    );
    return enrollmentIds;
}

const getBySessionId = async (sessionId) => {
    const enrollments = await Enrollment.find(
        {session: sessionId}
    );
    return enrollments;
}

const getIdsBySessionId = async (sessionId) => {
    const enrollmentIds = await Enrollment.find(
        {session: sessionId},
        {_id:1}
    );
    return enrollmentIds;
}

const EnrollmentService = {
    get,
    getById,
    getIdsBySessionId,
    getActiveBySessionId,
    getActiveIdsBySessionId,
    getBySessionId,
    getByUserId,
    create,
}


export { EnrollmentService }