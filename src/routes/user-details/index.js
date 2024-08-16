import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router({mergeParams: true});

router.use(verifyJWT);


import employeeRouter from "./employee.routes.js";
import orderRouter from "./order.routes.js";
import transactionRouter from "./transactions.routes.js";
import admissionRouter from "./admission.routes.js";
import enrollmentRouter from "./enrollments.routes.js";

router.route("/orders", orderRouter);
router.route("/transactions", transactionRouter);
router.route("/employee", employeeRouter);
router.route("/admission", admissionRouter);
router.route("/enrollments", enrollmentRouter);

export default router;