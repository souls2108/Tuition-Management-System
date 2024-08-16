import { Router } from "express"
import {
    getInstituteTransactions,
} from "../../../controllers/transaction.controller.js";

const router = Router();

router
    .route("/")
        .get(getInstituteTransactions);
        
export default router;