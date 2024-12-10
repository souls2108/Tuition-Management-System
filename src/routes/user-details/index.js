import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = new Router({mergeParams: true});

router.use(verifyJWT);


import employeeRouter from "./employee.routes.js";
import orderRouter from "./order.routes.js";
import transactionRouter from "./transactions.routes.js";
import admissionRouter from "./admission.routes.js";
import enrollmentRouter from "./enrollments.routes.js";

router.use("/orders", orderRouter);
router.use("/transactions", transactionRouter);
router.use("/employee", employeeRouter);
router.use("/admission", admissionRouter);
router.use("/enrollments", enrollmentRouter);

export default router;