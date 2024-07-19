import { Router } from "express";
import { removeEmployee } from "../controllers/employee.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyEmp } from "../middlewares/employeeVerify.middleware.js";

const router = Router();

router.route("/:instituteId/remove-emp").delete(verifyJWT, verifyEmp, removeEmployee)

export default router;