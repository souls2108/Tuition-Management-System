import { Router } from "express"
import {
    createTransaction,
    getUserTransactions,
} from "../../controllers/transaction.controller.js";

const router = Router();

router
    .route("/")
        .get(getUserTransactions)
        .post(createTransaction);
        
export default router;