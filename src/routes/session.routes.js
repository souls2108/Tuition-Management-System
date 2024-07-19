import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyEmp } from "../middlewares/employeeVerify.middleware.js";

const router = Router();
router.use(verifyJWT);
router.use(verifyEmp);
//TODO: SESSION routes
router
    .route("/:instituteId/session")
        .post()
        .get()
        .patch()
        .delete()

export default router;