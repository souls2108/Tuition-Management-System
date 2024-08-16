import { Router } from "express";
import { 
    createInstitute, 
    getAllInstitute,
    getInstitute,
    getInstituteByName,

} from "../../controllers/institute.controller.js";

const router = Router();

router.route("/create-institute").post(createInstitute);
router.route("/all").get( getAllInstitute);
router.route("/name").get( getInstituteByName)
router.route("/:instituteId").get( getInstitute)


export default router;