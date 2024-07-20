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

const EnrollmentService = {
    get,
    create,
}


export { EnrollmentService }