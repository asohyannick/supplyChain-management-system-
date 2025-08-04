import express from "express";
import { createPayment, paymentSucceeded } from "../../services/paypalPayment/paypalPayment";
const router = express.Router();
// Route to create a PayPal payment
router.post("/create", createPayment);
// Route to handle successful PayPal payment
router.get("/success", paymentSucceeded);
export default router