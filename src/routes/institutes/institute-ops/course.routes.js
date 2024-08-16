import { Router } from "express"
import {
    createCourse,
    getAllCourses,
    updateCourse,
    deleteCourse,
} from "../../../controllers/course.controller.js"

const router = Router();

router
    .route("/")
        .get(getAllCourses)
        .post(createCourse)
        .patch(updateCourse)
        .delete(deleteCourse);

export default router;