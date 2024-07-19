import { Employee } from "../models/employee.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//TEST: EMP M/W
export const verifyEmp = asyncHandler(async (req, _, next) => {
    const instituteId = req.params.instituteId || req.body.instituteId;
    const userId = req.user?._id;
    if(!userId || !instituteId ) {
        throw new ApiError(400, "InstituteId and userId are required.");
    }
    try {    
        const emp = await Employee.findOne({ $and: {user:userId, institute:instituteId}});

        if(!emp) {
            throw new ApiError(403, "Employee not registered to Institute.");
        }

        req.emp = emp;
        next();
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error?.message 
            || "Error while employee login");
    }
})