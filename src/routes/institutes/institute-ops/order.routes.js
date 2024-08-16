import { Router } from "express"
import {
    getOrdersInstitute,
    createOrder,
    updateOrderAmount,
    deleteOrder,
} from "../../../controllers/order.controller.js";

const router = Router();

router
    .route("/")
        .get(getOrdersInstitute)
        .post(createOrder)
        .patch(updateOrderAmount)
        .delete(deleteOrder);
        
export default router;