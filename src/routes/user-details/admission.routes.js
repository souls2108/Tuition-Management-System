import { Router } from "express"
import {
    getUserAdmissions
} from "../../controllers/admission.controller.js";

const router = Router();

router
    .route("/")
        .get(getUserAdmissions);
                
export default router;