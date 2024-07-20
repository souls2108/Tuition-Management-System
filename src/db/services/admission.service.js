import { Admission } from "../../models/admission.model.js";



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

const getByInstitute = async (instituteId, page, limit) => {
    const options = {page: page || 1, limit: limit || 10}
    const aggregate = Admission.aggregate(
        [
            {
                $match: {
                    institute: instituteId
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    _id: 0,
                    addmissionId: '$_id',
                    userId: '$user._id',
                    displayName: '$user.displayName',
                    email: '$user.email',
                    phone: '$user.phone',
                }
            }
        ]
    );

    const students = await Admission.aggregatePaginate(
        aggregate,
        options
    )

    return students.docs;
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
    getByInstitute,
    create,
    deleteById,
}

export { AdmissionService };