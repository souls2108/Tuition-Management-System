import { Router } from "express"
import { addSessionAttendance, getClassDates } from "../../../../controllers/session.controller.js";

const router = Router();

//TODO: IMP!! Attendance controllers
router
    .route("/")
        .get(getClassDates)
        .post(addSessionAttendance);

export default router;