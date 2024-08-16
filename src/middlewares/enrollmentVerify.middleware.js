import { EnrollmentService } from "../db/services/enrollment.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const verifyEnroll = asyncHandler(async (req, _, next) => {
    const enrollId = req.params.enrollId || req.body.enrollId;
    const user = req.user;
    if(!user) {
        throw new ApiError(401, "User must be logged in");
    }
    if (!enrollId) {
        throw new ApiError(400, "enrollId is required");
    }

    try {
        const enrollment = await EnrollmentService.getById(enrollId);
        if(!enrollment) {
            throw new ApiError(403, "Not enrolled to session");
        }
        req.enrollment = enrollment;
        
        next();
    } catch (error) {
        throw new ApiError(error.statusCode || 500, "Error while finding enrollment");
    }
})