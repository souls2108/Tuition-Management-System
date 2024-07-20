import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyEmp } from "../middlewares/employeeVerify.middleware.js";
import { verifyStudent } from "../middlewares/studentVerify.middleware.js";
import { createCourse, deleteCourse, getAllCourses, updateCourse } from "../controllers/course.controller.js";

const router = Router();
router.use(verifyJWT);

router
    .route("/:instituteId/course")
        .post(verifyEmp, createCourse)
        .get(verifyEmp, getAllCourses)
        .patch(verifyEmp, updateCourse)
        .delete(verifyEmp, deleteCourse) //TEST: course deletion

router.route("/:instituteId/course-student").get(verifyStudent, getAllCourses)

export default router;