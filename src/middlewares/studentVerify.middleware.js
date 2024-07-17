import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Admission } from "../models/admission.model.js";

// TEST student middleware
export const verifyStudent = asyncHandler( async (req, res, next) => {
    const instituteId = req.params.instituteId || req.body.instituteId;
    const userId = req.user._id;

    if(!userId || !instituteId?.trim() === "" ) {
        throw new ApiError(400, "InstituteId and userId are required.");
    }
    
    try {
        const student = await Admission.findOne(
            {
                user: userId,
                institute: instituteId,
            }
        );

        if (!student) {
            throw new ApiError(404, "Student registration for institute not found");
        }

        res.student = student;
        next();
    } catch {
        throw new ApiError(500, error?.message 
            || "Error while student login");
    }

})