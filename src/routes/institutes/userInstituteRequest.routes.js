import { Router } from "express";
import { 
    getUserInstituteRequests,
    createUserInstituteRequest,
    updateUserInstituteRequest,
 } from "../../controllers/userInstituteRequest.controller.js";

const router = Router();

router
    .route("/")
        .get(getUserInstituteRequests)
        .post(createUserInstituteRequest)
        .patch(updateUserInstituteRequest)

export default router;