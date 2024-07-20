import { AdmissionService } from "../db/services/admission.service.js";
import { EmployeeServices } from "../db/services/employee.service.js";
import { InstituteService } from "../db/services/institute.service.js";
import { UserService } from "../db/services/user.service.js";
import { InstituteRequestService } from "../db/services/userInstituteRequest.service.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const existedRequestEmployeeStudent = async( userId, instituteId, roleType) => {   
    const existedRequest = await InstituteRequestService.get(userId, instituteId)
    if(existedRequest) {
        throw new ApiError(400, "Request to Institute already exists.");
    }
    // CHECK existing Student OR Employee with same role
    if (roleType === "STUDENT") {
        const existedStudent = await AdmissionService.get(userId, instituteId);
        if(existedStudent) {
            throw new ApiError(400, "User already admitted in Institute.");
        }
    } else {
        const existedEmp = await EmployeeServices.get(userId, instituteId);
        if(existedEmp && existedEmp.role === roleType) {
            throw new ApiError(400, "User already employee at institute.");
        }
        if(existedEmp.role === "OWNER") {
            throw new ApiError(400, "Owner cannot be requested to change role");
        }
    }
}

const handleAcceptedRequest = async ( request) => {
    const user = await UserService.getById( request.user);
    const institute = await InstituteService.getById( request.institute);
    if(!user) {
        throw new ApiError(404, "User Not Found");
    }
    if(!institute) {
        throw new ApiError(404, "Institute Not Found");
    }

    let requestConfirmation;
    if(request.roleType === "STUDENT") {
        requestConfirmation = await AdmissionService.create(
            request.user,
            request.institute
        );
    }
    else {
        if(request.roleType === "OWNER") {
            const prevOwner = await EmployeeServices.getInstituteOwner(institute._id);
            await EmployeeServices.update(prevOwner._id, "ADMIN");
        }
        const existedEmp = await EmployeeServices.get(
            request.user,
            request.institute
        );
        if (!existedEmp) {
            requestConfirmation = await EmployeeServices.create(
                user._id,
                institute._id,
                request.roleType
            );
        } else {
            requestConfirmation = await EmployeeServices.update(
                existedEmp._id,
                request.roleType
            );
        }
    }

    return requestConfirmation;
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

    const institute = await InstituteService.getById( instituteId);
    if(!institute) {
        throw new ApiError(404, "Institute Not Found");
    }

    await existedRequestEmployeeStudent(userId, instituteId, roleType);
    try {    
        const userRequest = await InstituteRequestService.create(
            userId,
            instituteId,
            roleType,
            {userStatus: "ACCEPT"},
        );

        return res
        .status(201)
        .json(
            new ApiResponse(
                201, 
                userRequest,
                "Request  for Institute created"
            )
        );
    } catch (error) {
        throw new ApiError(500, error?.message 
            || "Error while creating request Institute.");
    }
})

const getUserInstituteRequests = asyncHandler( async (req, res) => {
    if(!req.user?._id) {
        throw new ApiError(400, "User id is required.");
    }
    try {
        const userInstituteRequests = await InstituteRequestService.getUser(req.user._id)
        
        if(userInstituteRequests.length === 0) {
            return res
            .status(200)
            .json(new ApiResponse(200, {}, "No pending requests for User"));
        }

        return res
        .status(200)
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
    if(!requestId) {
        throw new ApiError(400, "RequestId is required.");
    }
    if(!user) {
        throw new ApiError(401, "user must be logged in")
    }

    const request = await InstituteRequestService.getById(requestId);
    if(!request) {
        throw new ApiError(404, "Request not found.");
    }
    if(!request.user.equals(user._id)) {
        throw new ApiError(409, "User login and user request does not match");
    }
    if(request.userStatus === userStatus) {
        throw new ApiError(400, "Updated userStatus same as current userStatus");
    }

    request.userStatus = userStatus;
    let requestConfirmation;
    if(request.userStatus === "REJECT") {
        res.status(200).json(new ApiResponse(200, {}, "Request cancelled.")) ;
    }
    else if(request.userStatus === "ACCEPT" && request.instituteStatus === "ACCEPT" ) {
        requestConfirmation = await handleAcceptedRequest(request);
        req.status(200).json(new ApiResponse(200, requestConfirmation, "Request accepted."));
    }

    const deletedRequest = await InstituteRequestService.deleteRequest(request._id);
    if(!deletedRequest) {
        throw new ApiError(500, "Error while request deletion");
    }

    return res;
});


// Institute functions
const verifyInstituteRequestPermission = (emp, roleType = "") => {
    const allowedRoles = ["OWNER", "ADMIN"];

    if(!roleType) {
        return allowedRoles.includes(emp.role);
    }
    //XXX: move to constants 
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
        throw new ApiError(400, "addUserId, roleType field are required.");
    }
    const emp = req.emp;
    if(!verifyInstituteRequestPermission(emp, roleType)) {
        throw new ApiError(403, "Not sufficient permissions to perform action.");
    }
    

    const existedUser = await UserService.getById(addUserId);
    if(!existedUser) {
        throw new ApiError(404, "User Not Found");
    }

    await existedRequestEmployeeStudent(addUserId, emp.institute, roleType);
    
    const instituteRequest = await InstituteRequestService.create(
        addUserId,
        emp.institute,
        roleType,
        {instituteStatus: "ACCEPT"},
    );

    return res.status(201)
    .json(
        new ApiResponse(
            201, 
            instituteRequest,
            "Request for user created"
        )
    );
})

const getInstituteUserRequests = asyncHandler( async (req, res) => {
    const instituteId = req.emp.institute;
    const emp = req.emp;
    if( !verifyInstituteRequestPermission(emp)) {
        throw new ApiError(
            403, 
            "Not sufficient permissions to perform action."
        );
    }

    const userInstituteRequests = await InstituteRequestService
        .getInstitute(instituteId);
        
    if(userInstituteRequests.length === 0) {
        return res
        .status(200)
        .json(new ApiResponse(
            200, {}, "No pending requests for Institute"
        ));
    }
    return res
    .status(200)
    .json(new ApiResponse(
        200, userInstituteRequests, "Institute requests fetched."
    ));

})

const updateInstituteUserRequest = asyncHandler( async (req, res) => {
    const emp = req.emp;
    const { requestId, instituteStatus } = req.body;
    const statusOptions = ["ACCEPT", "REJECT"]

    if(!instituteStatus 
        || !statusOptions.includes(instituteStatus)) {
        throw new ApiError(400, "instituteStatus invalid");
    }
    if(!requestId) {
        throw new ApiError(400, "RequestId is required.");
    }

    const request = await InstituteRequestService.getById(requestId);
    if(!request) {
        throw new ApiError(404, "Request not found.");
    }
    if(!request.institute.equals(emp.institute)) {
        throw new ApiError(409, "Employee login and institute request does not match");
    }
    if(!verifyInstituteRequestPermission(emp, request.roleType)) {
        throw new ApiError(
            403, 
            "Not sufficient permissions to perform action."
        );
    }
    if(request.instituteStatus === instituteStatus) {
        throw new ApiError(400, "Updated instituteStatus same as current instituteStatus");
    }

    request.instituteStatus = instituteStatus;

    if(request.instituteStatus === "REJECT") {
        res.status(200).json(new ApiResponse(200, {}, "Request cancelled.")) ;
    }
    else if(request.userStatus === "ACCEPT" && request.instituteStatus === "ACCEPT" ) {
        const requestConfirmation = await handleAcceptedRequest(request);
        res.status(200).json(new ApiResponse( 200, requestConfirmation, "Request accepted"));
    }


    const deletedRequest = await InstituteRequestService.deleteRequest(request._id);
    if(!deletedRequest) {
        throw new ApiError(500, "Error while request deletion");
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