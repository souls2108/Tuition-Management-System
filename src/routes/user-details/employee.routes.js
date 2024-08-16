import { Router } from "express"
import {
    getUserEmployments
} from "../../controllers/employee.controller.js";

const router = Router();

router
    .route("/")
        .get(getUserEmployments);
                
export default router;