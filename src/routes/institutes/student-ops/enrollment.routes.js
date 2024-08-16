import { Router } from "express"
import {
    getEnrollmentDetailsById,
} from "../../../controllers/enrollment.controller.js"
import { verifyEnroll } from "../../../middlewares/enrollmentVerify.middleware.js";
import { getExamResultStats } from "../../../controllers/session.controller.js";


const router = Router();

router.use(verifyEnroll)

router.route("/").get( getEnrollmentDetailsById);
router.route("/exam-stats").get( getExamResultStats);

export default router;