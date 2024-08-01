import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyEmp } from "../middlewares/employeeVerify.middleware.js";
import {verifyStudent } from "../middlewares/studentVerify.middleware.js";
import {
    getStudentEnrollRequests,
    createStudentEnrollRequest,
    updateStudentEnrollRequest,
    getInstituteEnrollRequests,
    createInstituteEnrollRequest,
    updateInstituteEnrollRequest,
} from "../controllers/enrollmentRequest.controller.js";

const router = Router();

// student only routes
router
    .route("/:instituteId/student")
        .get(verifyJWT, verifyStudent, getStudentEnrollRequests)
        .post(verifyJWT, verifyStudent, createStudentEnrollRequest)
        .patch(verifyJWT, verifyStudent, updateStudentEnrollRequest)

// emp only routes
router
    .route("/:instituteId/institute")
        .get(verifyJWT, verifyEmp, getInstituteEnrollRequests)
        .post(verifyJWT, verifyEmp, createInstituteEnrollRequest)
        .patch(verifyJWT, verifyEmp, updateInstituteEnrollRequest)

export default router;