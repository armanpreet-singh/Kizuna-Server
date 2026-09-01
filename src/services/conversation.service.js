import { Conversation } from "../models/conversation.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../lib/cloudinary.js";

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

const removeParticipant = async (conversationId, requesterId, userId) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  // Only groups can have members removed
  if (conversation.type !== "group") {
    throw new ApiError(400, "Members can only be removed from group conversations");
  }

  // Only group admin can remove members
  if (conversation.groupAdmin.toString() !== requesterId.toString()) {
    throw new ApiError(403, "Only the group admin can remove members");
  }

  // Admin cannot remove themselves
  if (conversation.groupAdmin.toString() === userId.toString()) {
    throw new ApiError(400, "Group admin cannot be removed");
  }

  // Check whether the user is actually a participant
  const isParticipant = conversation.participants.some(
    (participant) => participant.toString() === userId.toString()
  );

  if (!isParticipant) {
    throw new ApiError(400, "User is not a participant");
  }

  conversation.participants = conversation.participants.filter(
    (participant) => participant.toString() !== userId.toString()
  );

  await conversation.save();

  return conversation;
};

const leaveGroup = async (conversationId, userId) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  if (conversation.type !== "group") {
    throw new ApiError(400, "Only group conversations can be left");
  }

  const isParticipant = conversation.participants.some(
    (participant) => participant.toString() === userId.toString()
  );

  if (!isParticipant) {
    throw new ApiError(403, "You are not a participant of this group");
  }

  // Admin cannot leave until another admin is assigned
  if (conversation.groupAdmin.toString() === userId.toString()) {
    throw new ApiError(400, "Group admin cannot leave the group. Transfer admin role first.");
  }

  conversation.participants = conversation.participants.filter(
    (participant) => participant.toString() !== userId.toString()
  );

  await conversation.save();

  return conversation;
};

const changeGroupAdmin = async (conversationId, requesterId, newAdminId) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  if (conversation.type !== "group") {
    throw new ApiError(400, "Only group conversations can have an admin");
  }

  // Only current admin can transfer the admin role
  if (conversation.groupAdmin.toString() !== requesterId.toString()) {
    throw new ApiError(403, "Only the group admin can change the admin");
  }

  // Check whether the new admin exists
  const newAdmin = await User.findById(newAdminId);

  if (!newAdmin) {
    throw new ApiError(404, "New admin not found");
  }

  // New admin must already be a group participant
  const isParticipant = conversation.participants.some(
    (participant) => participant.toString() === newAdminId.toString()
  );

  if (!isParticipant) {
    throw new ApiError(400, "New admin must already be a participant of the group");
  }

  // Prevent unnecessary admin transfer
  if (conversation.groupAdmin.toString() === newAdminId.toString()) {
    throw new ApiError(400, "User is already the group admin");
  }

  conversation.groupAdmin = newAdminId;

  await conversation.save();

  return conversation;
};

const updateGroupDetails = async (conversationId, requesterId, { name, description }) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  if (conversation.type !== "group") {
    throw new ApiError(400, "Only group conversations can be updated");
  }

  if (conversation.groupAdmin.toString() !== requesterId.toString()) {
    throw new ApiError(403, "Only the group admin can update the group");
  }

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      throw new ApiError(400, "Group name cannot be empty");
    }

    conversation.name = name.trim();
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      throw new ApiError(400, "Group description must be a string");
    }

    conversation.description = description.trim();
  }

  await conversation.save();

  return conversation;
};

const updateGroupAvatar = async ({ conversationId, userId, file }) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  if (conversation.type !== "group") {
    throw new ApiError(400, "Only group conversations can have an avatar");
  }

  if (conversation.groupAdmin.toString() !== userId.toString()) {
    throw new ApiError(403, "Only the group admin can update the group avatar");
  }

  if (!file) {
    throw new ApiError(400, "Avatar file is required");
  }

  const uploadedFile = await uploadOnCloudinary(file.path);

  if (!uploadedFile) {
    throw new ApiError(500, "Failed to upload group avatar");
  }

  // Delete the previous custom avatar if one exists
  if (conversation.groupAvatarPublicId) {
    await deleteFromCloudinary(conversation.groupAvatarPublicId);
  }

  conversation.groupAvatar = uploadedFile.secure_url || uploadedFile.url;

  conversation.groupAvatarPublicId = uploadedFile.public_id;

  await conversation.save();

  return conversation;
};

export {
  createConversation,
  getUserConversations,
  getConversationById,
  findDirectConversation,
  addParticipant,
  removeParticipant,
  leaveGroup,
  changeGroupAdmin,
  updateGroupDetails,
  updateGroupAvatar,
};
