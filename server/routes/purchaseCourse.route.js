import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createCheckoutSession, getAllPurchasedCourse, getCourseDetailWithPurchaseStatus, getInstructorSales, stripeWebhook } from "../controllers/coursePurchase.controller.js";

const router = express.Router();

router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession);
router.route("/webhook").post(stripeWebhook);
router.route("/course/:courseId/detail-with-status").get(isAuthenticated, getCourseDetailWithPurchaseStatus);
router.route("/instructor-sales").get(isAuthenticated, getInstructorSales);

router.route("/").get(isAuthenticated, getAllPurchasedCourse);

export default router;