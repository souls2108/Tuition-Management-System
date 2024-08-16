import { Router } from "express";

const router = Router();

import sessionRouter from "./session.routes.js"
import enrollmentRouter from "./enrollment.routes.js"
import examRouter from "./exam.routes.js"
import resultRouter from "./result.routes.js"
import attendanceRouter from "./attendance.routes.js"
import orderRouter from "../order.routes.js"

router.use("/sessions", sessionRouter);
router.use("/enrollments", enrollmentRouter);
router.use("/exam", examRouter);
router.use("/result", resultRouter);
router.use("/attendance", attendanceRouter);
router.use("/orders", orderRouter);

export default router;