import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createConversationController,
  getMyConversations,
  getConversation,
  getDirectConversation,
  addParticipantController,
  removeParticipantController,
  leaveGroupController,
  changeGroupAdminController,
  updateGroupDetailsController,
  updateGroupAvatarController,
} from "../controllers/conversation.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(verifyJWT);

router.post("/", asyncHandler(createConversationController));

router.get("/", asyncHandler(getMyConversations));

router.get("/direct/:userId", asyncHandler(getDirectConversation));

router.post("/:conversationId/participants", asyncHandler(addParticipantController));

router.delete("/:conversationId/participants/:userId", asyncHandler(removeParticipantController));

router.delete("/:conversationId/leave", asyncHandler(leaveGroupController));

router.patch("/:conversationId/admin", asyncHandler(changeGroupAdminController));

router.patch("/:conversationId", asyncHandler(updateGroupDetailsController));

router.get("/:conversationId", asyncHandler(getConversation));

router.patch(
  "/:conversationId/avatar",
  upload.single("avatar"),
  asyncHandler(updateGroupAvatarController)
);


export default router;
