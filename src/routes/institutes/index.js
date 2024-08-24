import Router from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = new Router({mergeParams: true});

router.use(verifyJWT);

import userInstituteRequestRouter from "./userInstituteRequest.routes.js";
import instituteRouter from "./institute.routes.js"
import instituteOperationsRouter from "./institute-ops/index.js"
import studentOperationsRouter from "./student-ops/index.js"

router.use("/userInstituteRequest", userInstituteRequestRouter);
router.use("/i", instituteRouter);
router.use("/:instituteId/institute-ops", instituteOperationsRouter);
router.use("/:instituteId/student-ops", studentOperationsRouter);

export default router;