import mongoose from "mongoose";
import {
  CONVERSATION_TYPES,
  DEFAULT_GROUP_AVATAR,
  PARTICIPANT_LIMITS,
} from "../constants/index.js";

const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(CONVERSATION_TYPES),
      required: true,
      default: CONVERSATION_TYPES.DIRECT,
      trim: true,
    },

    name: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    groupAvatar: {
      type: String,
      default: DEFAULT_GROUP_AVATAR,
      trim: true,
    },

    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

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
