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

  if (!Array.isArray(participants) || participants.length === 0) {
    throw new ApiError(400, "Participants are required");
  }

  // Prevent duplicate direct conversations
  if (type === "direct") {
    if (participants.length !== 2) {
      throw new ApiError(400, "Direct conversations must contain exactly two participants");
    }

    if (!participants.some((id) => id.toString() === createdBy.toString())) {
      throw new ApiError(403, "Creator must be one of the participants");
    }

    const existingConversation = await Conversation.findDirectConversation(
      participants[0],
      participants[1]
    );

    if (existingConversation) {
      return existingConversation;
    }
  }

  // Group creator should be admin
  if (type === "group") {
    if (!groupAdmin) {
      groupAdmin = createdBy;
    }

    if (!participants.some((id) => id.toString() === createdBy.toString())) {
      participants.push(createdBy);
    }
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
  return Conversation.find({
    participants: userId,
  })
    .populate("participants", "username fullName avatar")
    .populate("groupAdmin", "username fullName avatar")
    .populate("createdBy", "username fullName avatar")
    .populate("lastMessage")
    .sort({ lastActivity: -1 });
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
  const conversation = await Conversation.findDirectConversation(userOneId, userTwoId);

  if (!conversation) {
    throw new ApiError(404, "Direct conversation not found");
  }

  await conversation.populate([
    {
      path: "participants",
      select: "username fullName avatar",
    },
    {
      path: "lastMessage",
    },
  ]);

  return conversation;
};

const addParticipant = async (conversationId, requesterId, userId) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  // Only groups can have members added
  if (conversation.type !== "group") {
    throw new ApiError(400, "Members can only be added to group conversations");
  }

  // Only group admin can add members
  if (conversation.groupAdmin.toString() !== requesterId.toString()) {
    throw new ApiError(403, "Only the group admin can add members");
  }

  // Check whether the user exists
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User to add not found");
  }

  // Prevent duplicate participants
  if (
    conversation.participants.some((participant) => participant.toString() === userId.toString())
  ) {
    throw new ApiError(400, "User is already a participant");
  }

  conversation.participants.push(userId);

  await conversation.save();

  return conversation;
};

export {
  createConversation,
  getUserConversations,
  getConversationById,
  findDirectConversation,
  addParticipant,
};
