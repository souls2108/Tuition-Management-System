import { Router } from "express"
import { addExam, updateExam } from "../../../../controllers/session.controller.js";

const router = Router();

router
    .route("/")
        .post(addExam)
        .patch(updateExam)

export default router;