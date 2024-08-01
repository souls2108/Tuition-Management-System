import { Router } from "express";
import { getInstituteEmployees, removeEmployee } from "../controllers/employee.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyEmp } from "../middlewares/employeeVerify.middleware.js";

const router = Router();
router.use(verifyJWT);
router.route("/:instituteId/all").get( verifyEmp, getInstituteEmployees);
router.route("/:instituteId/remove-emp").delete( verifyEmp, removeEmployee);


export default router;