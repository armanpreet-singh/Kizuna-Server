import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createMessageController,
  getMessagesController,
  editMessageController,
  deleteMessageController,
  markMessageAsReadController,
} from "../controllers/message.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(verifyJWT);

router.post("/", asyncHandler(createMessageController));

router.get("/:conversationId", asyncHandler(getMessagesController));

router.patch("/:messageId", asyncHandler(editMessageController));

router.delete("/:messageId", asyncHandler(deleteMessageController));

router.patch("/:messageId/read", asyncHandler(markMessageAsReadController));

export default router;
