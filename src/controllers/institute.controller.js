import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Institute } from "../models/institute.model.js";
import { Employee } from "../models/employee.model.js";


const createInstitute = asyncHandler( async (req, res) => {
    const { instituteName } = req.body;
    const user = req.user;
    if(!instituteName || instituteName.trim() === "") {
        throw new ApiError(400, "Institute name field cannot be empty.");
    }
    if(!user) {
        throw new ApiError(400, "User must be logged in.");
    }

    try {
        const existedInstitute = await Institute.findOne({
            instituteName
        });

        if(existedInstitute) {
            throw new ApiError(409, "Institute name already in use.");
        }

        const institute = await Institute.create({
            instituteName: instituteName,
            founder: user._id,
        });

        const emp = await Employee.create({
            user: user._id,
            institute,
            role: "OWNER",
        });

        return res.status(201)
        .json( new ApiResponse(201, {institute, emp}, "Institue created."))
        
    } catch (error) {
        throw new ApiError(500, error?.message 
            || "Error while creating DB entry.")
    }
});



export {
    createInstitute
}