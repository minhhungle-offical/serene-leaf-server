import express from "express";
import {
  createSubscription,
  getSubscriptions,
} from "../controllers/subscribeController";

const router = express.Router();

router.post("/", createSubscription);
router.get("/", getSubscriptions);

export default router;
