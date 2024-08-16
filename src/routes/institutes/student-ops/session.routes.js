import { Router } from "express"
import {
    getActiveSessions,
    getCourseSessions,

} from "../../../controllers/session.controller.js"


const router = Router();

router.route("/course").get(getCourseSessions);
router.route("/active").get(getActiveSessions);

export default router;