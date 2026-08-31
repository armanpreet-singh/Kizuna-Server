import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createConversationController,
  getMyConversations,
  getConversation,
  getDirectConversation,
  addParticipantController,
} from "../controllers/conversation.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(verifyJWT);

router.post("/", asyncHandler(createConversationController));

router.get("/", asyncHandler(getMyConversations));

router.get("/direct/:userId", asyncHandler(getDirectConversation));

router.post("/:conversationId/participants", asyncHandler(addParticipantController));

router.get("/:conversationId", asyncHandler(getConversation));


export default router;
