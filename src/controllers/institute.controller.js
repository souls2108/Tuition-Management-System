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
        throw new ApiError(401, "User must be logged in.");
    }

    try {
        //XXX: Use service
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

const getAllInstitute = asyncHandler( async (req, res) => {
    const { limit } = req.body;

    const allInstitutes = await Institute.find({}, null, {limit} || { limit: 10});

    return res.status(200)
    .json(new ApiResponse(200, allInstitutes, "All institute details fetched."))
})

const getInstitute = asyncHandler( async (req, res) => {
    const {instituteId} = req.params;
    console.log(req.params);

    if(!instituteId?.trim()) {
        throw new ApiError(400, "Institute field cannot be empty.");
    }

    const institute = await Institute.findById(instituteId);

    if(!institute) {
        throw new ApiError(404, "Institute Not Found");
    }

    // IDEA: Student Cnt Employee Cnt Active Courses

    return res.status(200)
    .json(
        new ApiResponse(200, institute, "Institute details fetched.")
    )
})

const getInstituteByName = asyncHandler( async (req, res) => {
    const {instituteName} = req.body;

    if(!instituteName?.trim()) {
        throw new ApiError(400, "Institute field cannot be empty.");
    }

    const institute = await Institute.findOne({ instituteName });

    if(!institute) {
        throw new ApiError(404, "Institute Not Found");
    }

    // IDEA: Student Cnt Employee Cnt Active Courses

    return res.status(200)
    .json(
        new ApiResponse(200, institute, "Institute details fetched.")
    )
})

// const empInstituteLogin = asyncHandler( async (req, res) => {
//     const { instituteId } = req.body;
//     console.log(instituteId);
//     if(!instituteId || !req.user?._id ) {
//         throw new ApiError(400, "InstituteId and user are required.");
//     }

//     const emp = await Employee.findOne({
//         $and: [
//             { user: req.user._id },
//             { institute: instituteId }
//         ]
//     });

//     if (!emp) {
//         throw new ApiError(404, "Employee registration not found.");
//     }

//     const empToken = emp.generateToken();

//     const options = {
//         httpOnly: true,
//         secure: true,
//     };
    
//     return res.status(200)
//     .cookie("empToken", empToken, options)
//     .json(
//         new ApiResponse(
//             200,
//             emp,
//             "Employee logged in successfully"
//         )
//     )
// })

export {
    createInstitute,
    getAllInstitute,
    getInstituteByName,
    getInstitute,
}