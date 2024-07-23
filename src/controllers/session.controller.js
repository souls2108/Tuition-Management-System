import { AttendanceService } from "../db/services/attendance.service.js";
import { EmployeeServices } from "../db/services/employee.service.js";
import { EnrollmentService } from "../db/services/enrollment.service.js";
import { ExamService } from "../db/services/exam.service.js";
import { ResultService } from "../db/services/result.service.js";
import { SessionService } from "../db/services/session.service.js";
import { Session } from "../models/session.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const verifyHandleSessionPermission = async (loggedInEmp, sessionId) => {
    //XXX: move constants
    const permission = ["OWNER", "ADMIN"]
    if(!loggedInEmp || permission.includes(loggedInEmp)) {
        throw new ApiError(403, "Not sufficient permission to perform action");
    }

    if(!sessionId) return;
    
    const session = await SessionService
        .getSessionAndCourse(sessionId);
    if(!session || !session.course.institute) {
        throw new ApiError(404, "Session or Course not found");
    }
    if( !session.course.institute.equals(loggedInEmp.institute)) {
        throw new ApiError(409, "Course does not belong to institute")
    };
}


const getCourseSessions = asyncHandler( async (req, res) => {
    const { courseId } = req.body;

    if(!courseId) {
        throw new ApiError(400, "courseId field is required");
    }

    const sessions = await Session.find(courseId);

    if(!sessions.length) {
        return res.status(200).json(new ApiResponse(200, {}, "No sessions for course."));
    }
    return res.status(200).json(new ApiResponse(200, { sessions }, "Sessions fetched for course."));
});

const getActiveSessions = asyncHandler( async (req, res) => {
    const instituteId = req.params.instituteId || req.body.instituteId;
    const sessions = await SessionService.getByInstitute(instituteId);

    if(!sessions.length) {
        return res.status(200).json(new ApiResponse(200, {}, "No sessions for institute."));
    }

    return res.status(200).json(new ApiResponse(200, {sessions}, "Sessions of institute"));
})

const createSession = asyncHandler(async (req, res) => {
    await verifyHandleSessionPermission(req.emp);

    const { courseId, startAt, endAt, fees,  isActive, instructor} = req.body;
    if (!courseId) {
        throw new ApiError(400, "courseId field is required");
    }
    if (!fees) {
        throw new ApiError(400, "fees field is required");
    }
    if(startAt && endAt && Date(endAt) < Date(startAt)) {
        throw new ApiError(409, "endDate cannot be before startDate")
    }

    const doc = {
        course: courseId,
        startAt: startAt || Date.now(),
        endAt,
        fees,
        isActive,
    }
    const existInstructor = await EmployeeServices.getById(instructor)
    if(existInstructor) {
        doc.instructor = instructor;
    }

    const session = await Session.create(doc);

    return res.status(201).json(new ApiResponse(201, session, "Session created"));
});

const updateSession = asyncHandler( async (req, res) => {
    const {sessionId, courseId, startAt, endAt, fees, isActive, instructor} = req.body;
    if(!sessionId) {
        throw new ApiError(400, "sessionId is required");
    }
    if(!courseId || !startAt || !endAt || !fees) {
        throw new ApiError(400, "courseId, startAt, endAt, fees are required");
    }

    await verifyHandleSessionPermission(req.emp, sessionId);

    const session = await Session.findByIdAndUpdate(
        sessionId,
        {
            $set:{
                course: courseId,
                startAt,
                endAt,
                fees,
                isActive,
                instructor,
            },
        },
        {new: true}
    );

    return res.status(200).json(new ApiResponse(200, session, "Session details updated"));
});

const deleteSession =  asyncHandler( async (req, res) => {
    const {sessionId} = req.body;

    await verifyHandleSessionPermission(req.emp, sessionId);

    await Session.findByIdAndDelete(sessionId);

    return res.status(204).json(new ApiResponse(204, {}, "Course deleted"))
});


// ---- session operations ----
const getSessionEnrollments = asyncHandler( async (req, res) => {
    const { institute } = req.emp;
    const { sessionId } = req.params;
    if(!institute) {
        throw new ApiError(400, "Institute required, emp must be logged in.")
    }
    const { activeOnly } = req.body;

    await verifyHandleSessionPermission(req.emp, sessionId);

    let enrollments;
    if (Boolean(activeOnly) === true) {
        enrollments = await EnrollmentService.getActiveBySessionId(sessionId);
    }
    else {
        enrollments = await EnrollmentService.getBySessionId(sessionId);
    }

    return res
    .status(200)
    .json(new ApiResponse(200, { enrollments }, "Enrollments fetched"));
});

//attendance
const addSessionAttendance = asyncHandler(async (req, res) => {
    const sessionId = req.params
    const { attendees } = req.body;
    const duration = req.body.duration || 1;
    const start = req.body.start || Date.now();
    if(!attendees || !Array.isArray(attendees) || attendees.length === 0) {
        throw new ApiError(400, "Invalid attendance posted.");
    }
    const invalidAttendanceData = attendees.findIndex( (attendee) => {
        if(!attendee || !attendee.enrollment || !attendee.status 
            || !["PRESENT", "ABSENT"].includes(attendee.status)) {
            return true
        }
    })

    if(invalidAttendanceData !== -1) {
        throw new ApiError(400, `Invalid data attendees: ${invalidAttendanceData}`);
    }

    const attendeesMap = new Map(attendees.map((attendee) => [attendee.enrollment, attendee]))

    const activeEnrollments = await EnrollmentService.getActiveIdsBySessionId(sessionId)
    const attendance = activeEnrollments.map((enrollment) => {
        let status = "NA";
        if(attendeesMap.has(enrollment._id)) {
            status = attendeesMap.get(enrollment._id).status;
        }
        return {
            enrollment: enrollment._id,
            start,
            duration,
            status,
        }
    });

    const result = await SessionService.addForSession(attendance);

    return res.status(201)
    .json(new ApiResponse(201, {attendance: result}, "Attendance added"));
})

const getClassDates = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    if(!sessionId) {
        throw new ApiError(400, "SessionId is required")
    }

    const enrollmentIds = await EnrollmentService.getIdsBySessionId(sessionId);
    const classDates = await AttendanceService.getByEnrollId(enrollmentIds);

    return res.status(200).json(new ApiResponse(200, classDates, "Class dates fetched"));
})

//TODO: Add them to routes
//exam
const addExam = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const { examName, topics, time, fullMarks} = req.body;
    if(!sessionId) {
        throw new ApiError(400, "SessionId is required");
    }

    if(!examName || !fullMarks) {
        throw new ApiError(400, "examName fullMarks required");
    }

    await verifyHandleSessionPermission(req.emp, sessionId);
    try {
        const exam = await ExamService.create(sessionId, examName, topics, time || Date.now(), fullMarks); 
        return res.status(201).json(new ApiResponse(201, exam, "Exam created"));
    } catch (error) {
        throw new ApiError(error?.statusCode || 500, error?.message || "Something went wrong while creating exam",
            error, error?.stack);
    }
})

const updateExam = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const {examId,  examName, topics, time, fullMarks} = req.body;
    if(!examId || !sessionId) {
        throw new ApiError(400, "examId, SessionId are required");
    }
    await verifyHandleSessionPermission(req.emp, sessionId);

    const oldExam = await ExamService.getById(examId);
    if(!oldExam || !oldExam.session.equals(sessionId)) {
        throw new ApiError(404, "exam not found");
    }

    if(!examName || !fullMarks) {
        throw new ApiError(400, "examName fullMarks required");
    }

    try {
        const exam = await ExamService.update(examId, examName, topics, time, fullMarks);
        return res.status(200).json(new ApiResponse(200, exam, "Exam updated"));
    } catch (error) {
        throw new ApiError(error?.statusCode || 500, error?.message || "Something went wrong while creating exam",
            error, error?.stack);       
    }
})

//result
const addSessionResult = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const {examId, results} = req.body;
    if(!sessionId || !examId) {
        throw new ApiError(400, "SessionId, examId is required");
    }

    await verifyHandleSessionPermission(req.emp, sessionId);

    const exam = await ExamService.getById(examId);
    if(!exam || !exam.session.equals(sessionId)) {
        throw new ApiError(404, "exam not found");
    }

    if(!results || !Array.isArray(results) || results.length === 0) {
        throw new ApiError(400, "Invalid scores posted.");
    }

    const invalidResultData = results.findIndex( (result) => {
        if(!result || !result.enrollment || !result.marksScored 
            || result.marksScored > exam.fullMarks) {
            return true
        }
    })

    if(invalidResultData !== -1) {
        throw new ApiError(400, `Invalid data results: ${invalidResultData}`);
    }

    const enrollmentIds = Set(await EnrollmentService.getActiveIdsBySessionId(sessionId));
    const activeResults = results
    .filter((result) => {
        if (enrollmentIds.has( result.enrollment)) {
            return true;
        }
    })
    .map( (result) => {
        return {
            enrollment: result.enrollment,
            marksScored: result.marksScored,
            exam: examId,
        }
    })
    ;
    try{
        const createdResults = await ResultService.createForSession(results);
        return res.status(201).json(201, {createdResults}, "Created results");
    } catch (error) {
        throw new ApiError(error?.statusCode || 500, error?.message || "Something went wrong while adding results");
    }

})

const getExamResultStats = asyncHandler( async (req, res) => {
    const { sessionId } = req.params;
    const {examId } = req.body;
    if(!examId) {
        throw new ApiError(400, "examId is required");
    }
    await verifyHandleSessionPermission(req.emp, sessionId);
    const exam = await ExamService.getById(examId);
    if(!exam || !exam.session.equals(sessionId)) {
        throw new ApiError(404, "exam not found");
    }
    
    const resultStats = await ResultService.getResultStats(examId);

    return res.status(200).json(new ApiResponse(200, {resultStats}, "Result stats fetched"))
})

export {
    createSession,
    getCourseSessions,
    updateSession,
    deleteSession,
    getActiveSessions
}