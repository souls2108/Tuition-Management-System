import { AdmissionService } from "../db/services/admission.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyStudentRemovePermission = (loggedInEmp, student) => {
    //XXX: Move to constants as removal permission
    const permissions = ["OWNER", "ADMIN", "TEACHER"]
    return permissions.includes(loggedInEmp.role);
}

const removeStudentByEmp = asyncHandler(async (req, res) => {
    const emp = req.emp;
    const { admissionId, forceRemoveStudent} = req.body;
    if(!emp) {
        throw new ApiError(401, "Employee must be logged in");
    }
    if(!admissionId) {
        throw new ApiError(400, "admissionId is required.");
    }

    const student = await AdmissionService.getById(admissionId);
    if(!student) {
        throw new ApiError(404, "Student does not exist");
    }
    if(student.institute !== emp.institute) {
        throw new ApiError(409, "Student does not belong to institute")
    }
    if(!verifyStudentRemovePermission) {
        throw new ApiError(403, "Not sufficient permissions to perform action.");
    }

    if(!forceRemoveStudent) {
        //TODO: Check for pending orders at institue SERVICE
        throw new ApiError(409, "Student has pending orders at Institute");
    }
    //TODO: Service to remove Orders, make enrollments inactive
    const deletedAdmission = await AdmissionService.deleteById(admissionId);
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {
                user: deletedAdmission.user,
                institute: deletedAdmission.institute
            },
            "Student removed"
        )
    )
})

//TODO: removeStudentBySelf




export {
    removeStudentByEmp,
}

// XXX : Remove file
const createAdmission = async (userId, instituteId)=>{
    if (!userId || !instituteId) {
        throw new ApiError(400, "UserId & InstituteId required for admission.");
    }

    try {
        const admission = await Admission.fin(userId, instituteId);
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


