import { Router } from "express"
import {
    getUserEnrollments
} from "../../controllers/enrollment.controller.js";

const router = Router();

router
    .route("/")
        .get(getUserEnrollments);
                
export default router;