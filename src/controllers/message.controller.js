import {
  createMessage,
  getConversationMessages,
  editMessage,
} from "../services/message.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createMessageController = async (req, res) => {
  const { conversationId, content, messageType, attachment } = req.body;

  const message = await createMessage({
    conversationId,
    senderId: req.user._id,
    content,
    messageType,
    attachment,
  });

  return res.status(201).json(new ApiResponse(201, message, "Message created successfully"));
};

const getMessagesController = async (req, res) => {
  const messages = await getConversationMessages({
    conversationId: req.params.conversationId,
    userId: req.user._id,
  });

  return res.status(200).json(new ApiResponse(200, messages, "Messages fetched successfully"));
};

const editMessageController = async (req, res) => {
  const { content } = req.body;

  const message = await editMessage({
    messageId: req.params.messageId,
    userId: req.user._id,
    content,
  });

  return res.status(200).json(new ApiResponse(200, message, "Message updated successfully"));
};

export { createMessageController, getMessagesController, editMessageController };
