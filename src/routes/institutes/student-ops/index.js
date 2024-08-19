import { Router } from "express";
import { verifyStudent } from "../../../middlewares/studentVerify.middleware.js";

const router = Router({mergeParams: true});

router.use(verifyStudent);

import enrollmentRequestRouter from "./enrollmentRequest.routes.js";
import sessionRouter from "./session.routes.js";
import courseRouter from "./course.routes.js";
import enrollmentRouter from "./enrollment.routes.js";


router.use("/enrollment-request", enrollmentRequestRouter);
router.use("/session", sessionRouter);
router.use("/course", courseRouter);
router.use("/:enrollId", enrollmentRouter);

export default router;