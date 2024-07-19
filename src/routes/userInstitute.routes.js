import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyEmp } from "../middlewares/employeeVerify.middleware.js";
import { 
    getUserInstituteRequests,
    createUserInstituteRequest,
    updateUserInstituteRequest,
    getInstituteUserRequests,
    createInstituteUserRequest,
    updateInstituteUserRequest,
 } from "../controllers/userInstituteRequest.controller.js";

const router = Router();

// TEST: STUDENT ADMISSION ROUTE
router
    .route("/request")
        .get(verifyJWT, getUserInstituteRequests)
        .post(verifyJWT, createUserInstituteRequest)
        .patch(verifyJWT, updateUserInstituteRequest)

// emp only routes
router
    .route("/:instituteId/request")
        .get(verifyJWT, verifyEmp, getInstituteUserRequests)
        .post(verifyJWT, verifyEmp, createInstituteUserRequest)
        .patch(verifyJWT, verifyEmp, updateInstituteUserRequest)

export default router;