import { InstituteService } from "../db/services/institute.service.js";
import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const verifyHandleCoursePermission = async (loggedInEmp, courseId) => {
    //XXX: move constants
    const permission = ["OWNER", "ADMIN"]
    if(!loggedInEmp || permission.includes(loggedInEmp)) {
        throw new ApiError(403, "Not sufficient permission to perform action");
    }

    if(!courseId) return;
    
    const course = await Course.findById(courseId);
    if(!course) {
        throw new ApiError(404, "Course not found");
    }
    if( !course.institute.equals(loggedInEmp.institute)) {
        throw new ApiError(409, "Course does not belong to institute")
    };
}


const getAllCourses = asyncHandler( async (req, res) => {
    const instituteId = req.emp.institute;
    if(!instituteId) {
        throw new ApiError(400, "instituteId field is required");
    }

    const courses = await Course.find(
        {institute: instituteId}
    );
    if(!courses.length) {
        return res.status(200).json(new ApiResponse(200, {}, "No courses for institute."));
    }
    return res.status(200).json(new ApiResponse(200, { courseCount: courses.length, courses }, "Courses fetched for institute."));
});

const createCourse = asyncHandler(async (req, res) => {
    
    await verifyHandleCoursePermission(req.emp);

    const instituteId = req.emp.institute;
    const {subject, grade, isActive, description} = req.body;
    if(!instituteId) {
        throw new ApiError(400, "instituteId field is required");
    }
    if(!InstituteService.getById(instituteId)) {
        throw new ApiError(404, "institute Not Found");
    }
    if(!subject || !grade) {
        throw new ApiError(400, "subject and grade is required");
    }

    const course = await Course.create({
        subject,
        grade,
        institute: instituteId,
        isActive,
        description,
    });

    return res.status(201).json(new ApiResponse(201, course, "Course created"));
});

const updateCourse = asyncHandler(async (req, res) => {  
    const {courseId, subject, grade, isActive, description} = req.body;
    if(!courseId) {
        throw new ApiError(400, "courseId is required");
    }
    if(!subject || !grade) {
        throw new ApiError(400, "subject and grade are required");
    }
    
    await verifyHandleCoursePermission(req.emp, courseId);


    const course = await Course.findByIdAndUpdate(
        courseId,
        {
            $set:{
                subject,
                grade,
                isActive,
                description
            }
        },
        {new: true}
    );

    return res.status(200).json(new ApiResponse(200, course, "Course details updated"));
});

const deleteCourse = asyncHandler(async (req, res) => {

    const {courseId} = req.body;

    await verifyHandleCoursePermission(req.emp, courseId);

    await Course.findByIdAndDelete(courseId);

    return res.status(204).json(new ApiResponse(204, {}, "Course deleted"))
});


export {
    createCourse,
    getAllCourses,
    updateCourse,
    deleteCourse,
}