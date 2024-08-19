import { Router } from "express";

const router = Router();

import enrollmentRouter from "./enrollment.routes.js"
import examRouter from "./exam.routes.js"
import resultRouter from "./result.routes.js"
import attendanceRouter from "./attendance.routes.js"

router.use("/enrollments", enrollmentRouter);
router.use("/exam", examRouter);
router.use("/result", resultRouter);
router.use("/attendance", attendanceRouter);

export default router;