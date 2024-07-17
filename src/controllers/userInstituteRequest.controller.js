import { Employee } from "../models/employee.model.js";
import { Institute } from "../models/institute.model.js";
import { User } from "../models/user.model.js";
import { UserInstituteRequest } from "../models/userInstituteRequest.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createAdmission, getAdmission } from "./admission.controller.js";
import { createEmp, getEmployee, updateEmp } from "./employee.controller.js";

//HACK: MOVE TO SERVICE
const existedRequestEmployeeStudent = async( userId, instituteId, roleType) => {   
    const existedRequest = await UserInstituteRequest.findOne(
        {institute: instituteId, user: userId}
    );
    if(existedRequest) {
        throw new ApiError(400, "Request to Institute already exists.");
    }
    // CHECK EXISTING STUDENT OR Employee with same role
    if (roleType === "STUDENT") {
        const existedStudent = await getAdmission(userId, instituteId);
        if(existedStudent) {
            throw new ApiError(400, "User already admitted in Institute.");
        }
    } else {
        const existedEmp = await getEmployee(userId, instituteId);
        if(existedEmp && existedEmp.role === roleType) {
            throw new ApiError(400, "User already employee at institute.");
        }
    }
}

const createUserInstituteRequest = asyncHandler( async (req, res) => {
    const { instituteId, roleType } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "User id is required.");
    }

    if(!instituteId || !roleType) {
        throw new ApiError(400, "InstituteId and roleType is required.");
    }

    try {
        const institute = Institute.findById( instituteId);
        if(!institute) {
            throw new ApiError(404, "Institute Not Found");
        }

        await existedRequestEmployeeStudent(userId, instituteId, roleType);
        
        const userRequest = await UserInstituteRequest.create({
            institute: instituteId,
            user: userId,
            roleType,
            userStatus: "ACCEPT",
        });

        return res.status(201)
        .json(
            201,
            new ApiResponse(
                201, 
                userRequest,
                "Request  for Institute created"
            )
        );
    } catch (error) {
        throw new ApiError(500, error?.message 
            || "Error while requesting Institute.");
    }
})

const getUserInstituteRequests = asyncHandler( async (req, res) => {
    if(!req.user?._id) {
        throw new ApiError(400, "User id is required.");
    }
    try {
        const userInstituteRequests = await UserInstituteRequest.find({user: req.user._id});
        
        if(userInstituteRequests.length === 0) {
            return res.status(200).json(new ApiResponse(200, {}, "No pending requests"));
        }
        return res.status(200)
        .json( new ApiResponse(200, userInstituteRequests, "User requests fetched."));
    } catch (error) {
        throw new ApiError(500, error?.message 
            || "Something went wrong while fetching requests");
    }
});

const updateUserInstituteRequest = asyncHandler( async (req, res) => {
    const { requestId, userStatus } = req.body;
    const user = req.user;
    const statusOptions = ["ACCEPT", "REJECT"]
    
    if(!userStatus 
        || !statusOptions.includes(userStatus)) {
        throw new ApiError(400, "UserStatus invalid");
    }
    if(!requestId || !user) {
        throw new ApiError(400, "RequestId and user are required.");
    }

    try {
        const request = await UserInstituteRequest.findById(requestId);
        if(!request) {
            throw new ApiError(404, "Request not found.");
        }
        if(request.user != user._id) {
            throw new ApiError(409, "User login and user request does not match");
        }

        request.userStatus = userStatus;
        
        if(request.userStatus === "REJECT") {
            res.status(200).json(new ApiResponse(200, {}, "Request cancelled.")) ;
        }
        else if(request.userStatus === "ACCEPT" && request.instituteStatus === "ACCEPT" ) {
            // HACK: SERVICE Admission of student or employee
            const institute = await Institute.findById(request.institute);
            if(!institute) {
                throw new ApiError(404, "Institute Not Found");
            }

            let requestConf;
            if(request.roleType === "STUDENT") {
                requestConf = createAdmission(request.user, request.institute);
            }
            else {
                const emp = await Employee.findOne(
                    {
                        user:user._id, 
                        institute:institute._id
                    }
                );
                if (!emp) {
                    requestConf = createEmp(user._id, institute._id, request.roleType);
                } else {
                    requestConf = updateEmp(user._id, institute._id, request.roleType);
                }
            }

            res.status(200).json(new ApiResponse( 200, requestConf, "Request accepted"));

            const deletedRequest = await UserInstituteRequest.findByIdAndDelete(request._id);
            
            if(!deletedRequest) {
                throw new ApiError(500, "Error while request deletion");
            }
        }
    } catch (error) {
        throw new ApiError(500, error?.message || "Error while updating request")
    }

    return res;
});


// Institute functions
const verifyInstituteRequestPermission = (emp, roleType = "") => {
    const allowedRoles = ["OWNER", "ADMIN"];

    if(!roleType) {
        return allowedRoles.includes(emp.role);
    }
    const permissions = {
        "OWNER": ["OWNER", "ADMIN", "TEACHER", "STUDENT"],
        "ADMIN": ["ADMIN", "TEACHER", "STUDENT"],
    }
    //XXX: test shorthand condition
    if (permissions.hasOwnProperty(emp.role) && permissions[emp.role].includes(roleType)) {
        return true;
    }
    return false;
}

const createInstituteUserRequest = asyncHandler( async (req, res) => {
    const { addUserId, roleType } = req.body;
    if(!addUserId || !roleType) {
        throw new ApiError(403, "addUserId, roleType field are required.");
    }
    //HACK: MOVE TO SERVICE, remove import
    const existedUser = await User.findById(addUserId);
    if(!existedUser) {
        throw new ApiError(404, "User Not Found");
    }


    const emp = req.emp;
    if(!verifyInstituteRequestPermission(emp, roleType)) {
        throw new ApiError(401, "Not sufficeint permissions to perform action.");
    }

    try {
        await existedRequestEmployeeStudent(addUserId, emp.institute, roleType);
        
        const instituteRequest = await UserInstituteRequest.create({
            institute: emp.institute,
            user: addUserId,
            roleType,
            instituteStatus: "ACCEPT",
        });

        return res.status(201)
        .json(
            201,
            new ApiResponse(
                201, 
                instituteRequest,
                "Request for user created"
            )
        );        
    } catch (error) {
        throw new ApiError(500, error?.message
            || "Something went wrong while creating request"
        )
    }
})

const getInstituteUserRequests = asyncHandler( async (req, res) => {
    const instituteId = req.params.instituteId || req.body.instituteId;
    if(!instituteId) {
        throw new ApiError(400, "InstituteId field is required.");
    }
    //HACK: service check instituteId exist
    const emp = req.emp;
    if( !verifyInstituteRequestPermission(emp)) {
        throw new ApiError(403, "Not sufficeint permissions to perform action.");
    }

    try {
        const userInstituteRequests = await UserInstituteRequest.find({institute: emp.institute});
        
        if(userInstituteRequests.length === 0) {
            return res.status(200).json(new ApiResponse(200, {}, "No pending requests"));
        }
        return res.status(200)
        .json( new ApiResponse(200, userInstituteRequests, "Institute requests fetched."));
    } catch (error) {
        throw new ApiError(500, error?.message 
            || "Something went wrong while fetching requests");
    }
})

const updateInstituteUserRequest = asyncHandler( async (req, res) => {
    const { requestId, instituteStatus } = req.body;
    const emp = req.emp;
    const statusOptions = ["ACCEPT", "REJECT"]

    if(!instituteStatus 
        || !statusOptions.includes(instituteStatus)) {
        throw new ApiError(400, "instituteStatus invalid");
    }
    if(!requestId || !emp) {
        throw new ApiError(400, "RequestId and employee are required.");
    }

    try {
        //HACK: create service
        const request = await UserInstituteRequest.findById(requestId);
        if(!request) {
            throw new ApiError(404, "Request not found.");
        }
        console.log(request.institute._id, emp.institute);
        if(!request.institute.equals(emp.institute)) {
            throw new ApiError(409, "Employee login and institute request does not match");
        }

        request.instituteStatus = instituteStatus;

        if(request.userStatus === "REJECT") {
            res.status(200).json(new ApiResponse(200, {}, "Request cancelled.")) ;
        }
        else if(request.userStatus === "ACCEPT" && request.instituteStatus === "ACCEPT" ) {
            // HACK: SERVICE Admission of student or employee
            const existedUser = await User.findById(request.user);
            if(!existedUser) {
                throw new ApiError(404, "User Not Found");
            }

            let requestConf;
            if(request.roleType === "STUDENT") {
                requestConf = createAdmission(request.user, request.institute);
            }
            else {
                const emp = await Employee.findOne(
                    {
                        user:user._id, 
                        institute:institute._id
                    }
                );
                if (!emp) {
                    requestConf = createEmp(user._id, institute._id, request.roleType);
                } else {
                    requestConf = updateEmp(user._id, institute._id, request.roleType);
                }
            }

            res.status(200).json(new ApiResponse( 200, requestConf, "Request accepted"));

            const deletedRequest = await UserInstituteRequest.findByIdAndDelete(request._id);
            
            if(!deletedRequest) {
                throw new ApiError(500, "Error while request deletion");
            }
        }
    } catch (error) {
        throw new ApiError(500, error?.message || "Error while updating request", error?.stack)
    }

    return res;
})

export {
    createUserInstituteRequest,
    getUserInstituteRequests,
    updateUserInstituteRequest,
    createInstituteUserRequest,
    getInstituteUserRequests,
    updateInstituteUserRequest,
}