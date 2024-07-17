import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    createInstitute, 
    getAllInstitute,
    getInstitute,
    getInstituteByName,

} from "../controllers/institute.controller.js";

const router = Router();

router.use(verifyJWT);

//  HANDLE INSTITUE
// CREATE INSTITUTE
router.route("/create-institute").post(createInstitute);
// GET INSTITUTE
router.route("/i/all").get( getAllInstitute);
router.route("/i/name").get( getInstituteByName)
router.route("/i/:instituteId").get( getInstitute)

// TODO: INSTITUTE EMP REQUEST 

// TODO: INSTITUTE STUDENT REQUEST



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