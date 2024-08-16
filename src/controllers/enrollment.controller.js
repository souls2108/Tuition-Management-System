import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js"
import { EnrollmentService } from "../db/services/enrollment.service.js";
import { Enrollment } from "../models/enrollment.model.js";
import { AttendanceService } from "../db/services/attendance.service.js";
import { ResultService } from "../db/services/result.service.js";
import { SessionService } from "../db/services/session.service.js";


const verifyHandleEnrollPermission = async (loggedInEmp, enrollId) => {
    //XXX: move constants
    const permission = ["OWNER", "ADMIN", "TEACHER"]
    if(!loggedInEmp || permission.includes(loggedInEmp.role)) {
        throw new ApiError(403, "Not sufficient permission to perform action");
    }

    if(!enrollId) return;

    const enrollment = await Enrollment.findById(enrollId);
    if(!enrollment) {
        throw new ApiError(404, "Enollment not found");
    }
    
    const session = await SessionService
        .getSessionAndCourse(enrollment.session);
    if(!session || !session.course
        || !session.course.institute.equals(loggedInEmp.institute)
    ) {
        throw new ApiError(404, "Session/Course not found");
    }

    return enrollment;
}



const getUserEnrollments = asyncHandler(async (req, res) => {
    if(!req.user) {
        throw new ApiError(401, "User not logged in");
    }
    const enrollments = await EnrollmentService.getByUserId(req.user._id);
    return res.status(200).json(new ApiResponse(200, enrollments, "Enrollments fetched"));
})

const toggleEnrollmentActive = asyncHandler(async (req, res) => {
    const { enrollId } = req.body;
    if(!enrollId) {
        throw new ApiError(400, "enrollId is required");
    }

    const enrollment = await verifyHandleEnrollPermission(req.emp, enrollId);

    if( session.course.institute !== req.emp.institute ) {
        throw new ApiError(409, "Enrollment not of institute")
    }

    enrollment.isActive = (!enrollment.isActive);
    await enrollment.save();

    return res.status(200).json(new ApiResponse(200, enrollment, "Enrollment updated"));
});

const getEnrollmentDetailsById = asyncHandler(async (req, res) => {
    let enrollment;
    //for user's self enrollent
    if(req.enrollment) {
        enrollment = req.enrollment;
    } else {
        //employee view enrollment
        const { enrollId } = req.body;
        enrollment = await verifyHandleEnrollPermission(req.emp, enrollId);
    }
    if(!enrollment._id) {
        throw new ApiError(400, "Enrollment is required");
    }
    const attendance = await AttendanceService.getByEnrollId(enrollment._id);
    const exam = await ResultService.resultByEnrollId(enrollment._id);

    return res
    .status(200)
    .json(new ApiResponse(200, {enrollment, attendance, exam}, "All enrollment details"));
})



export {
    toggleEnrollmentActive,
    getUserEnrollments,
    getEnrollmentDetailsById,
}