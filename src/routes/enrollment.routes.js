import { Router } from "express";
import { verifyEmp } from "../middlewares/employeeVerify.middleware.js"
import { verifyStudent } from "../middlewares/studentVerify.middleware.js";
import { verifyEnroll } from "../middlewares/enrollmentVerify.middleware.js";
import { getSessionEnrollments, toggleEnrollmentActive, getUserEnrollments, getEnrollmentById } from "../controllers/enrollment.controller.js";


const router = Router();
router.use(verifyJWT);
//emp routes
router.route("/:instituteId/:sessionId/session-enroll").get( verifyEmp, getSessionEnrollments);
router.route("/:instituteId/:sessionId/").get(verifyEmp, )
router.route("/:instituteId/:sessionId/a").get()
router.route("/:instituteId/enroll-toggleActive").patch( verifyEmp, toggleEnrollmentActive);


//student routes
router.route("/:instituteId/user-enrolls").get(verifyStudent, getUserEnrollments);
router.route("/:instituteId/:enrollId").get(verifyEnroll, getEnrollmentById);

export default router;