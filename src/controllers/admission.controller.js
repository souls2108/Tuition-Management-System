import { Admission } from "../models/admission.model.js";
import { ApiError } from "../utils/ApiError.js";


const createAdmission = async (userId, instituteId)=>{
    if (!userId || !instituteId) {
        throw new ApiError(400, "UserId & InstituteId required for admission.");
    }

    try {
        const admission = await Admission.create({
            user: userId,
            institute: instituteId,
        });

        return admission;
    } catch (error) {
        throw new ApiError( 500, error?.message || "Error on admission DB.");
    }
}

const deleteAdmission = async (admissionId, userId, instituteId) => {
    try {
        if (admissionId) {
            const deletedAdmission = await Admission.findById(admissionId);
            if(!deletedAdmission) {
                throw new ApiError(404, "AdmissionId not found")
            }
        }
        else if (userId && instituteId) {
            const deletedAdmission = await Admission.findOneAndDelete(
                {user: userId, institute: instituteId}
            );
            if(!deletedAdmission) {
                throw new ApiError(404, "AdmissionId not found")
            }
        }
    } catch (error) {
        throw new ApiError(
            500, 
            error?.message || "Error while deleting admission"
        );
    }
}

const getAdmission = async (userId, instituteId) => {
    if(!userId || !instituteId) {
        throw new ApiError(500, "UserId & instituteId required to query AdmissionDB");
    }

    try {
        const admission = await Admission.findOne({user: userId, institute: instituteId});
        return admission;
    } catch (error) {
        throw new ApiError(500, error?.message
            || "Error while calling admission DB")
    }
}

const getAdmissionById = async (admissionId) => {
    if(!admissionId) {
        throw new ApiError(500, "AdmissionId is required to query AdmissionDB");
    }

    try {
        const admission = await Admission.findById({_id: admissionId});
        return admission;        
    } catch (error) {
        throw new ApiError(500, error?.message
            || "Error while calling admission DB")        
    }
}

const getUserAdmissions = async (userId) => {
    if(!userId) {
        throw new ApiError(500, "userId is required to query AdmissionDB");
    }

    try {
        const admission = await Admission.find({user: userId});
        return admission;        
    } catch (error) {
        throw new ApiError(500, error?.message
            || "Error while calling admission DB")        
    }
}

const getInstituteAdmissions = async (instituteId) => {
    if(!instituteId) {
        throw new ApiError(500, "instituteId is required to query AdmissionDB");
    }

    try {
        const admission = await Admission.find({institute: instituteId});
        return admission;        
    } catch (error) {
        throw new ApiError(500, error?.message
            || "Error while calling admission DB")        
    }
}



export {
    createAdmission,
    deleteAdmission,
    getAdmission,
    getAdmissionById,
    getUserAdmissions,
    getInstituteAdmissions
}