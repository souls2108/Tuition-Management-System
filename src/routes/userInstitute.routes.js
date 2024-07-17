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
router.use(verifyJWT);

// TEST: REQUEST ROUTE
router
    .route("/request")
        .get(getUserInstituteRequests)
        .post(createUserInstituteRequest)
        .patch(updateUserInstituteRequest)

// emp only routes
router
    .route("/:instituteId/request")
        .get(verifyEmp, getInstituteUserRequests)
        .post(verifyEmp, createInstituteUserRequest)
        .patch(verifyEmp, updateInstituteUserRequest)

export default router;

// TODO: CREATE COURSE
// TODO: CREATE SESSION