import Router from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = new Router();

router.use(verifyJWT);

import userInstituteRequestRouter from "./userInstituteRequest.routes.js";
import instituteRouter from "./institute.routes.js"
import instituteOperationsRouter from "./institute-ops/index.js"
import studentOperationsRouter from "./student-ops/index.js"

router.use("/userInstituteRequest", userInstituteRequestRouter);
router.use("/institute", instituteRouter);
router.use("/institute-ops", instituteOperationsRouter);
router.use("/student-ops", studentOperationsRouter);

export default router;