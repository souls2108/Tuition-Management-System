import { Router } from "express"
import {
    toggleEnrollmentActive,
    getEnrollmentDetailsById,
} from "../../../../controllers/enrollment.controller.js";

const router = Router();

router
    .route("/")
        .get(getEnrollmentDetailsById)
        .patch(toggleEnrollmentActive);

export default router;