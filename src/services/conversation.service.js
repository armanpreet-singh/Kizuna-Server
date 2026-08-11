import { Conversation } from "../models/conversation.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const createConversation = async ({
  type,
  participants,
  name,
  description,
  groupAdmin,
  groupAvatar,
  createdBy,
}) => {
  if (!createdBy) {
    throw new ApiError(400, "Creator is required");
  }

  const creator = await User.findById(createdBy);

  if (!creator) {
    throw new ApiError(404, "Creator not found");
  }

  const conversation = await Conversation.create({
    type,
    participants,
    name,
    description,
    groupAdmin,
    groupAvatar,
    createdBy,
  });

  return conversation;
};

const getUserConversations = async (userId) => {
  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate("participants", "username fullName avatar")
    .populate("groupAdmin", "username fullName avatar")
    .populate("createdBy", "username fullName avatar")
    .populate("lastMessage")
    .sort({ lastActivity: -1 });

  return conversations;
};

const getConversationById = async (conversationId, userId) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  })
    .populate("participants", "username fullName avatar")
    .populate("groupAdmin", "username fullName avatar")
    .populate("createdBy", "username fullName avatar")
    .populate("lastMessage");

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  return conversation;
};

const findDirectConversation = async (userOneId, userTwoId) => {
  return Conversation.findDirectConversation(userOneId, userTwoId)
    .populate("participants", "username fullName avatar")
    .populate("lastMessage");
};

export { createConversation, getUserConversations, getConversationById, findDirectConversation };
