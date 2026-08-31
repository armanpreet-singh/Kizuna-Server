import {
  createConversation,
  getUserConversations,
  getConversationById,
  findDirectConversation,
  addParticipant,
} from "../services/conversation.service.js";

const createConversationController = async (req, res) => {
  const { type, participants, name, description, groupAdmin, groupAvatar } = req.body;

  const conversation = await createConversation({
    type,
    participants,
    name,
    description,
    groupAdmin,
    groupAvatar,
    createdBy: req.user._id,
  });

  return res.status(201).json({
    success: true,
    message: "Conversation created successfully",
    data: conversation,
  });
};

const getMyConversations = async (req, res) => {
  const conversations = await getUserConversations(req.user._id);

  return res.status(200).json({
    success: true,
    message: "Conversations fetched successfully",
    data: conversations,
  });
};

const getConversation = async (req, res) => {
  const conversation = await getConversationById(req.params.conversationId, req.user._id);

  return res.status(200).json({
    success: true,
    message: "Conversation fetched successfully",
    data: conversation,
  });
};

const getDirectConversation = async (req, res) => {
  const conversation = await findDirectConversation(req.user._id, req.params.userId);

  return res.status(200).json({
    success: true,
    message: "Direct conversation fetched successfully",
    data: conversation,
  });
};

const addParticipantController = async (req, res) => {
  const { userId } = req.body;

  const conversation = await addParticipant(req.params.conversationId, req.user._id, userId);

  return res.status(200).json({
    success: true,
    message: "Participant added successfully",
    data: conversation,
  });
};

export {
  createConversationController,
  getMyConversations,
  getConversation,
  getDirectConversation,
  addParticipantController,
};
