import { Router } from "express"
import {
    getOrdersUser,
} from "../../controllers/order.controller.js";

const router = Router();

router
    .route("/")
        .get(getOrdersUser);
        
export default router;