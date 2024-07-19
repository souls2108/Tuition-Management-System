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


router.route("/create-institute").post(createInstitute);
router.route("/i/all").get( getAllInstitute);
router.route("/i/name").get( getInstituteByName)
router.route("/i/:instituteId").get( getInstitute)
//TODO: update institute
//TODO: delete institute



//      SECURE ROUTE
//
// TODO: UPDATE INSTITUTE DETAILS 
// TODO: DELETE INSTITUTE do it later

//  HANDLE EMP
// 
//      EMP STUDENT OP

// TODO: REMOVE STUDENT {FLAG IGNORE PENDING ORDERS} 
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