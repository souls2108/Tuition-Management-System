import { Router } from "express"
import {
    removeStudentByEmp,
    getInstituteStudents,
} from "../../../controllers/admission.controller.js"

const router = Router();

router
    .route("/")
        .get(getInstituteStudents)
        .delete(removeStudentByEmp);

export default router;