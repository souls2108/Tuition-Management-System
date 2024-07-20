import { asyncHandler } from "../utils/asyncHandler.js";
import { EnrollmentRequest } from "../models/userEnrollmentRequest.model.js";
import { EnrollmentRequestService } from "../db/services/enrollmentRequest.service.js"
import { EnrollmentService } from "../db/services/enrollment.service.js";
import { ApiError } from "../utils/ApiError.js";
import { SessionService } from "../db/services/session.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AdmissionService } from "../db/services/admission.service.js";


const existingRequestEnrollment = async (user, session) => {
    const existedRequest = await EnrollmentRequestService.get(user._id, session._id);
    const existedEnrollment = await EnrollmentService.get(user._id, session._id);
    if(existedRequest) {
        throw new ApiError(400, "Request to session already exists.");
    }
    if(existedEnrollment) {
        throw new ApiError(400, "Student already enrolled in Session");
    }
}

const verifySessionActive = async (sessionId, instituteId) => {
    const session = await SessionService.getSessionAndCourse(sessionId);
    if(!session ) {
        throw new ApiError(404, "session not found");
    }
    if(session.isActive == false) {
        throw new ApiError(400, "session is not active")
    }
    if(!session.course.institute.equals(instituteId)) {
        throw new ApiError(409, "session does not belong to institute");
    }
    return session;
}

const deleteEnrollRequest = async (requestId) => {
    const deletedRequest = await EnrollmentRequest.findByIdAndDelete(requestId);
    if(!deletedRequest) {
        throw new ApiError(500, "Error while request deletion");
    }
}

const handleAcceptedRequest = async (enrollRequest) => {
    const session = await SessionService.getSessionAndCourse(enrollRequest.session);
    if(!session) {
        await deleteEnrollRequest(enrollRequest._id);
        throw new ApiError(404, "session not found");
    }
    if(session.isActive == false) {
        await deleteEnrollRequest(enrollRequest._id);
        throw new ApiError(400, "session is not active")
    }
    const requestConfirmation = await EnrollmentService.create(
        enrollRequest.session, enrollRequest.user
    );
    return requestConfirmation;
}

const getStudentEnrollRequests = asyncHandler( async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "User must be logged in.");
    }

    try {
        const enrollRequests = await EnrollmentRequest.find({user: req.user._id});
    
        if(enrollRequests.length === 0) {
            return res
            .status(200)
            .json(new ApiResponse(200, {}, "No pending requests for User"));
        }
    
        return res
        .status(200)
        .json( new ApiResponse(200, enrollRequests, "User enroll requests fetched."));
    } catch (error) {
        throw new ApiError(500, error?.message 
            || "Something went wrong while fetching enroll requests");
    }
});


const createStudentEnrollRequest = asyncHandler( async (req, res) => {
    const { sessionId } = req.body;
    const instituteId = req.student.institute;
    const user = req.user;

    if(!sessionId) {
        throw new ApiError(400, "sessionId is required");
    }
    if(!user || !instituteId) {
        throw new ApiError(400, "user and institute are required");
    }

    const session = await verifySessionActive(sessionId, instituteId);

    await existingRequestEnrollment(user, session);
   
    const enrollRequest = await EnrollmentRequest.create({
        session: session._id,
        user: user._id,
        userStatus: "ACCEPT"
    });

    return res.status(201).json(
        new ApiResponse(
            201, enrollRequest, "Enroll request created"
        )
    )
});

const updateStudentEnrollRequest = asyncHandler( async (req, res) => {
    const { enrollRequestId, userStatus } = req.body;
    const user = req.user;
    const statusOptions = ["ACCEPT", "REJECT"];

    if(!userStatus 
        || !statusOptions.includes(userStatus)) {
        throw new ApiError(400, "UserStatus invalid");
    }
    if(!enrollRequestId) {
        throw new ApiError(400, "enrollRequestId is required.");
    }
    if(!user) {
        throw new ApiError(401, "user must be logged in")
    }

    const enrollRequest = await EnrollmentRequestService.getById(enrollRequestId);
    if(!enrollRequest) {
        throw new ApiError(404, "Request not found.");
    }
    if(!enrollRequest.user.equals(user._id)) {
        throw new ApiError(409, "User login and user request does not match");
    }
    if(enrollRequest.userStatus === userStatus) {
        throw new ApiError(400, "Updated userStatus same as current userStatus");
    }
    
    enrollRequest.userStatus = userStatus;
    let requestConfirmation;
    if(enrollRequest.userStatus === "REJECT") {
        res.status(200).json(new ApiResponse(200, {}, "Request cancelled"));
    }
    else if (enrollRequest.userStatus === "ACCEPT"
        && enrollRequest.instituteStatus === "ACCEPT") {
            requestConfirmation = await handleAcceptedRequest(enrollRequest);

            res.status(200).json(new ApiResponse(200, requestConfirmation, "Request accepted"));
    }

    await deleteEnrollRequest(enrollRequest._id);

    return res;
});


//institute only routes
const verifyEnrollmentRequestPermission = (emp, session) => {
    //XXX: move to constants
    const permissions = ["OWNER", "ADMIN", "TEACHER"];
    if(!permissions.includes(emp.role)) {
        throw new ApiError(403, "Not sufficient permission to perform action");
    }

    if(!session) return;

    if(!emp.institute.equals(session.course.institute)) {
        throw new ApiError(409, "Employee login & request do not match")
    }
}
const getInstituteEnrollRequests = asyncHandler( async (req, res) => {
    verifyEnrollmentRequestPermission(req.emp);

    const enrollRequests = await EnrollmentRequestService.getByInstituteId(req.emp.institute);

    return res.status(200).json(new ApiResponse(200, {enrollRequests}, "enroll requests fetched"));
});

const createInstituteEnrollRequest = asyncHandler( async (req, res) => {
    const {addUserId, sessionId} = req.body;
    if(!addUserId || !sessionId) {
        throw new ApiError(400, "addUserId, sessionId are required");
    }
    const emp = req.emp;
    
    verifyEnrollmentRequestPermission(emp);

    const student = await AdmissionService.get(addUserId, emp.institute);
    if(!student) {
        throw new ApiError(404, "Student Not Found");
    }

    const session = await verifySessionActive(sessionId, emp.institute);

    await existingRequestEnrollment(student, session);

    const enrollRequest = await EnrollmentRequest.create({
        session: session._id,
        user: student._id,
        instituteStatus: "ACCEPT"
    });

    return res.status(201).json(
        new ApiResponse(
            201, enrollRequest, "Enroll request created"
        )
    )
});

const updateInstituteEnrollRequest = asyncHandler( async (req, res) => {
    const emp = req.emp;
    const { enrollRequestId, instituteStatus } = req.body;
    const statusOptions = ["ACCEPT", "REJECT"]

    if(!instituteStatus 
        || !statusOptions.includes(instituteStatus)) {
        throw new ApiError(400, "instituteStatus invalid");
    }
    if(!enrollRequestId) {
        throw new ApiError(400, "enrollRequestId is required.");
    }

    const enrollRequest = await EnrollmentRequestService.getById(enrollRequestId);
    if(!enrollRequest) {
        throw new ApiError(404, "enrollRequest not found.");
    }
    if(!enrollRequest.institute.equals(emp.institute)) {
        throw new ApiError(409, "Employee login and institute request does not match");
    }
    if(enrollRequest.instituteStatus === instituteStatus) {
        throw new ApiError(400, "Updated instituteStatus and current instituteStatus cannot be same");
    }

    enrollRequest.instituteStatus = instituteStatus;
    let requestConfirmation;
    if(enrollRequest.instituteStatus === "REJECT") {
        res.status(200).json(new ApiResponse(200, {}, "Request cancelled.")) ;
    }
    else if (enrollRequest.userStatus === "ACCEPT"
        && enrollRequest.instituteStatus === "ACCEPT") {
            requestConfirmation = await handleAcceptedRequest(enrollRequest);

            res.status(200).json(new ApiResponse(200, requestConfirmation, "Request accepted"));
    }

    deleteEnrollRequest(enrollRequest._id);
    return res;
});


export {
    getStudentEnrollRequests,
    createStudentEnrollRequest,
    updateStudentEnrollRequest,
    getInstituteEnrollRequests,
    createInstituteEnrollRequest,
    updateInstituteEnrollRequest,
}