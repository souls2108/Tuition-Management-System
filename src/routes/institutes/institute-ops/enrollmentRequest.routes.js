import { Router } from "express"
import { 
    getInstituteEnrollRequests,
    createInstituteEnrollRequest,
    updateInstituteEnrollRequest,
} from "../../../controllers/enrollmentRequest.controller.js"

const router = Router();

router
    .route("/")
        .get(getInstituteEnrollRequests)
        .post(createInstituteEnrollRequest)
        .patch(updateInstituteEnrollRequest);

export default router;