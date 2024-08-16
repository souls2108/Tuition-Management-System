import { Router } from "express"
import {
    addSessionResult,
    getExamResultStats,
    updateResultEnrollId,
} from "../../../../controllers/session.controller.js"

const router = Router();

router
    .route("/")
        .get(getExamResultStats)
        .post(addSessionResult)
        .patch(updateResultEnrollId);

export default router;