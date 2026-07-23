import mongoose from "mongoose";
import {
  CONVERSATION_TYPES,
  DEFAULT_GROUP_AVATAR,
  PARTICIPANT_LIMITS,
} from "../constants/index.js";

const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    // Conversation type (direct or group)
    type: {
      type: String,
      enum: Object.values(CONVERSATION_TYPES),
      default: CONVERSATION_TYPES.DIRECT,
      required: true,
    },

    // Group name (required only for groups)
    name: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    // Optional group description
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    // Users participating in this conversation
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // Group administrator
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // User who created the conversation
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Group avatar URL
    groupAvatar: {
      type: String,
      default: DEFAULT_GROUP_AVATAR,
      trim: true,
    },

    // Latest message in this conversation
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    // Used for sorting chats
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* ------------------------- Validation Middleware ------------------------- */

conversationSchema.pre("validate", function (next) {
  // Remove duplicate participants
  this.participants = [...new Set(this.participants.map(String))];

  if (this.type === CONVERSATION_TYPES.DIRECT) {
    if (this.participants.length !== PARTICIPANT_LIMITS.DIRECT) {
      return next(new Error("Direct conversations must contain exactly two participants."));
    }

    // Direct chats don't need these fields
    this.name = undefined;
    this.description = "";
    this.groupAdmin = null;
    this.groupAvatar = DEFAULT_GROUP_AVATAR;
  }

  if (this.type === CONVERSATION_TYPES.GROUP) {
    if (this.participants.length < PARTICIPANT_LIMITS.GROUP_MIN) {
      return next(new Error("A group conversation must contain at least two participants."));
    }

    if (!this.name || !this.name.trim()) {
      return next(new Error("Group name is required."));
    }

    if (!this.groupAdmin) {
      return next(new Error("Group admin is required."));
    }

    // Ensure the admin is part of the group
    const isAdminParticipant = this.participants.some(
      (participant) => participant.toString() === this.groupAdmin.toString()
    );

    if (!isAdminParticipant) {
      return next(new Error("Group admin must be one of the participants."));
    }
  }

  next();
});

/* ------------------------------- Indexes -------------------------------- */

conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastActivity: -1 });
conversationSchema.index({ type: 1 });

/* --------------------------- Instance Methods --------------------------- */

conversationSchema.methods.isGroup = function () {
  return this.type === CONVERSATION_TYPES.GROUP;
};

conversationSchema.methods.isDirect = function () {
  return this.type === CONVERSATION_TYPES.DIRECT;
};

/* ---------------------------- Static Methods ---------------------------- */

conversationSchema.statics.findDirectConversation = function (userOneId, userTwoId) {
  return this.findOne({
    type: CONVERSATION_TYPES.DIRECT,
    participants: {
      $all: [userOneId, userTwoId],
      $size: 2,
    },
  });
};

export const Conversation = mongoose.model("Conversation", conversationSchema);
