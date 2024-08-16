import { Router } from "express"
import {
    createInstituteUserRequest,
    getInstituteUserRequests,
    updateInstituteUserRequest,
}from "../../../controllers/userInstituteRequest.controller.js"

const router = Router();

router
    .route("/")
        .get(getInstituteUserRequests)
        .post(createInstituteUserRequest)
        .patch(updateInstituteUserRequest);

export default router;