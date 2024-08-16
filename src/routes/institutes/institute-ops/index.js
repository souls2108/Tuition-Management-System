import { Router } from "express"
import { verifyEmp } from "../../../middlewares/employeeVerify.middleware.js"

const router = Router({ mergeParams: true });

router.use(verifyEmp);

import sessionRouter from "./session/index.js"
import admissionRouter from "./admission.routes.js"
import courseRouter from "./course.routes.js"
import employeeRouter from "./employee.routes.js"
import enrollmentRequestRouter from "./enrollmentRequest.routes.js"
import instituteUserRequestRouter from "./instituteUserRequest.routes.js"
import orderRouter from "./order.routes.js";
import transactionRouter from "./transactions.routes.js";

router.use("/:sessionId", sessionRouter);
router.use("/admission", admissionRouter);
router.use("/course", courseRouter);
router.use("/employee", employeeRouter);
router.use("/enroll-request", enrollmentRequestRouter);
router.use("/request", instituteUserRequestRouter);
router.use("/orders", orderRouter);
router.use("/transactions", transactionRouter);


export default router;