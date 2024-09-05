import { Router } from "express"
import { verifyEmp } from "../../../middlewares/employeeVerify.middleware.js"

const router = Router({ mergeParams: true });

router.use(verifyEmp);

import admissionRouter from "./admission.routes.js"
import courseRouter from "./course.routes.js"
import employeeRouter from "./employee.routes.js"
import enrollmentRequestRouter from "./enrollmentRequest.routes.js"
import instituteUserRequestRouter from "./instituteUserRequest.routes.js"
import orderRouter from "./order.routes.js";
import transactionRouter from "./transactions.routes.js";
import sessionOperationsRouter from "./session-ops/index.js"
import sessionRouter from "./session.routes.js"

router.use("/course", courseRouter);
router.use("/session", sessionRouter);
router.use("/admission", admissionRouter);
router.use("/employee", employeeRouter);
router.use("/enroll-request", enrollmentRequestRouter);
router.use("/request", instituteUserRequestRouter);
router.use("/orders", orderRouter);
router.use("/transactions", transactionRouter);
router.use("/:sessionId/session-ops", sessionOperationsRouter);


export default router;