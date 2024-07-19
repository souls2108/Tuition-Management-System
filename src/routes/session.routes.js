import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyEmp } from "../middlewares/employeeVerify.middleware.js";
import { createSession, deleteSession, getAllSessions, updateSession } from "../controllers/session.controller.js";

const router = Router();
router.use(verifyJWT);
router.use(verifyEmp);
//TEST: SESSION routes
router
    .route("/:instituteId/session")
        .post(createSession)
        .get(getAllSessions)
        .patch(updateSession)
        .delete(deleteSession)

export default router;