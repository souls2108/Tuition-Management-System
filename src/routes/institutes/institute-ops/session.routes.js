import { Router } from "express"
import {
    createSession,
    getCourseSessions,
    updateSession,
    deleteSession,
    getActiveSessions,
} from "../../../controllers/session.controller.js";

const router = Router();

router
    .route("/")
        .get(getActiveSessions)
        .post(createSession)
        .patch(updateSession)
        .delete(deleteSession);

router.route("/course").get(getCourseSessions);

export default router;