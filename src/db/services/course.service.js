import { Course } from "../../models/course.model"

const getById = async(courseId)=> {
    const course = await Course.findById(courseId);
    return course;
}


const CourseService = {
    getById,
}

export {CourseService}