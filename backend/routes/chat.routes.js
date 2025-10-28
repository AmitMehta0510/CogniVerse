import express from "express";
import {
  createOrContinueChat,
  getUserThreads,
  getThreadMessages,
  deleteThread,
} from "../controllers/chat.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/chat", protect, createOrContinueChat);
router.get("/threads", protect, getUserThreads);
router.get("/thread/:threadId", protect, getThreadMessages);
router.delete("/thread/:threadId", protect, deleteThread);

export default router;
