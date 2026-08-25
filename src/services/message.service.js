import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import { ApiError } from "../utils/ApiError.js";

const createMessage = async ({ conversationId, senderId, content, messageType, attachment }) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: senderId,
  });

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    content,
    messageType,
    attachment,
    readBy: [senderId],
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    $set: {
      lastMessage: message._id,
      lastActivity: new Date(),
    },
  });

  return message;
};

const getConversationMessages = async ({ conversationId, userId }) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  const messages = await Message.find({
    conversation: conversationId,
    deleted: false,
  })
    .populate("sender", "username fullName avatar")
    .populate("readBy", "username fullName avatar")
    .sort({ createdAt: 1 });

  return messages;
};

export { createMessage, getConversationMessages };
