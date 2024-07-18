import { Admission } from "../../models/admission.model";



const get = async (userId, instituteId) => {
    const student = await Admission.findOne(
        {institute: instituteId, user: userId}
    );
    return student;
}

const getById = async (admissionId) => {
    const admission = await Admission.findById(admissionId);
    return admission;
}

const create = async(userId, instituteId) => {
    const admission = await Admission.create({
        user: userId,
        institute: instituteId,
    });
    return admission;
}

const deleteById = async (admissionId) => {
    const deletedAdmission = await Admission.findById(admissionId);
    return deletedAdmission;
}

const AdmissionService = {
    get,
    getById,
    create,
    deleteById,
}

export { AdmissionService };