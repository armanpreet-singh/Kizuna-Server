import {
  createMessage,
  getConversationMessages,
  editMessage,
  deleteMessage,
  markMessageAsRead,
} from "../services/message.service.js";
import { uploadOnCloudinary } from "../lib/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createMessageController = async (req, res) => {
  const { conversationId, content, messageType } = req.body;

  let attachment;

  if (req.file) {
    const uploadedFile = await uploadOnCloudinary(req.file.path);

    if (!uploadedFile) {
      throw new ApiError(500, "Failed to upload attachment");
    }

    attachment = {
      url: uploadedFile.secure_url || uploadedFile.url,
      publicId: uploadedFile.public_id,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
    };
  }

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

const deleteMessageController = async (req, res) => {
  const message = await deleteMessage({
    messageId: req.params.messageId,
    userId: req.user._id,
  });

  return res.status(200).json(new ApiResponse(200, message, "Message deleted successfully"));
};

const markMessageAsReadController = async (req, res) => {
  const message = await markMessageAsRead({
    messageId: req.params.messageId,
    userId: req.user._id,
  });

  return res.status(200).json(new ApiResponse(200, message, "Message marked as read"));
};

export {
  createMessageController,
  getMessagesController,
  editMessageController,
  deleteMessageController,
  markMessageAsReadController,
};
