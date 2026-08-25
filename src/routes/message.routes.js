import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createMessageController,
  getMessagesController,
} from "../controllers/message.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(verifyJWT);

router.post("/", asyncHandler(createMessageController));

router.get("/:conversationId", asyncHandler(getMessagesController));

export default router;
