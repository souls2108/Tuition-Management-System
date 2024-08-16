import { Router } from "express"
import {
    getStudentEnrollRequests,
    createStudentEnrollRequest,
    updateStudentEnrollRequest,
} from "../../../controllers/enrollmentRequest.controller.js"

const router = Router();

router
    .route("/")
        .get(getStudentEnrollRequests)
        .post(createStudentEnrollRequest)
        .update(updateStudentEnrollRequest);
        
export default router;