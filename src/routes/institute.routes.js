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



export default router;