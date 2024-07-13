import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    createInstitute 
} from "../controllers/institute.controller.js";

const router = Router();
//  HANDLE INSTITUE
// TODO: CREATE INSTITUTE   1
router.route("/create-institute").post(verifyJWT, createInstitute)

// TODO: INSTITUTE EMPLOYEE m/w (just check user_id & institue_id DB) 1
// TODO: INSTITUTE STUDENT m/w 1
// TODO: INSTITUTE STUDENT REQUEST {C R U} 1
// TODO: INSTITUTE EMP REQUEST {C R U} 1



//      SECURE ROUTE
//
// TODO: UPDATE INSTITUTE DETAILS 
// TODO: DELETE INSTITUTE do it later

//  HANDLE EMP
// 
//      EMP EMP OP
// TODO: GET EMP REQUEST LIST
// TODO: UPDATE EMP REQUEST
// TODO: REMOVE EMPLOYEE
// 
//      EMP STUDENT OP
// TODO: GET STUDENT ADMISSION REQUEST LIST
// TODO: UPDATE STUDENT REQUEST
// TODO: REMOVE STUDENT {FLAG IGNORE PENDING ORDERS} 
// TODO: GET STUDENT ENROLL REQUEST LIST
// TODO: UPDATE STUDENT REQUEST
//      EMP COURSE OP
// TODO: CRUD
//      EMP SESSION OP
// TODO: SESSION CRUD
// TODO: EXAM CRUD
// TODO: ATTENDANCE CRUD
// TODO: ORDERS CRUD


//  HANDLE STUDENT
// TODO: ENROLL SESSION REQ
// TODO: GET EXAM
// TODO: GET ATTENDANCE
// TODO: GET ORDERS
// TODO: MAKE TRANS


export default router;