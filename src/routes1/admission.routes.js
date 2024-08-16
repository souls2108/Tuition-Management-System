import { Router } from "express";
import { getInstituteStudents, removeStudentByEmp } from "../controllers/admission.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyEmp } from "../middlewares/employeeVerify.middleware.js";
import { verifyStudent } from "../middlewares/studentVerify.middleware.js";

const router = Router();
router.route("/:instituteId/all").get( verifyJWT,verifyEmp, getInstituteStudents);
router.route("/:instituteId/remove-student").delete(verifyJWT, verifyEmp, removeStudentByEmp);
// router.route("/:instituteId/leave").delete(verifyStudent, studentLeave);


export default router;