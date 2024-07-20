import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { AdmissionService } from "../db/services/admission.service.js";

// TEST student middleware
export const verifyStudent = asyncHandler( async (req, res, next) => {
    const instituteId = req.params.instituteId || req.body.instituteId;
    const userId = req.user._id;

    if(!userId || !instituteId?.trim() === "" ) {
        throw new ApiError(400, "InstituteId and userId are required.");
    }
    
    try {
        const student = await AdmissionService.get(
            userId, instituteId
        );

        if (!student) {
            throw new ApiError(401, "Student not registered to institute.");
        }

        req.student = student;
        next();
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error?.message 
            || "Error while student login");
    }

})