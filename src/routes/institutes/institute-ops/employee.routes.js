import { Router } from "express"
import {
    removeEmployee,
    getInstituteEmployees,
} from "../../../controllers/employee.controller.js"

const router = Router();

router
    .route("/")
        .get(getInstituteEmployees)
        .delete(removeEmployee);

export default router;