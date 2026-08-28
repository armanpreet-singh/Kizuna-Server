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

const editMessage = async ({ messageId, userId, content }) => {
  const message = await Message.findOne({
    _id: messageId,
    sender: userId,
    deleted: false,
  });

  if (!message) {
    throw new ApiError(404, "Message not found or you are not the sender");
  }

  if (!content || !content.trim()) {
    throw new ApiError(400, "Message content cannot be empty");
  }

  message.content = content.trim();
  message.edited = true;

  await message.save();

  return message;
};

const deleteMessage = async ({ messageId, userId }) => {
  const message = await Message.findOne({
    _id: messageId,
    sender: userId,
    deleted: false,
  });

  if (!message) {
    throw new ApiError(404, "Message not found or you are not the sender");
  }

  message.deleted = true;
  message.content = "";

  await message.save();

  return message;
};

const markMessageAsRead = async ({ messageId, userId }) => {
  const message = await Message.findOne({
    _id: messageId,
    deleted: false,
  });

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  const conversation = await Conversation.findOne({
    _id: message.conversation,
    participants: userId,
  });

  if (!conversation) {
    throw new ApiError(403, "You are not a participant in this conversation");
  }

  if (!message.readBy.some((id) => id.toString() === userId.toString())) {
    message.readBy.push(userId);
    await message.save();
  }

  return message;
};

export { createMessage, getConversationMessages, editMessage, deleteMessage, markMessageAsRead };
