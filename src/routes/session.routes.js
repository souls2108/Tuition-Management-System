import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyEmp } from "../middlewares/employeeVerify.middleware.js";
import { createSession, deleteSession, getActiveSessions, getCourseSessions, updateSession } from "../controllers/session.controller.js";

const router = Router();
router.use(verifyJWT);
//TEST: SESSION routes
router
    .route("/:instituteId/session")
        .post(verifyEmp, createSession)
        .get(verifyEmp, getCourseSessions)
        .patch(verifyEmp, updateSession)
        .delete(verifyEmp, deleteSession)
//FIXME
router.route("/:instituteId/session/all").get(verifyEmp, getActiveSessions)

export default router;