import mongoose from "mongoose";
import { MESSAGE_TYPES, MESSAGE_LIMITS } from "../constants/message.constants.js";

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    // Conversation this message belongs to
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    // User who sent the message
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Type of message
    messageType: {
      type: String,
      enum: Object.values(MESSAGE_TYPES),
      default: MESSAGE_TYPES.TEXT,
      required: true,
    },

    // Message text
    content: {
      type: String,
      trim: true,
      maxlength: MESSAGE_LIMITS.CONTENT_MAX,
      default: "",
    },

    // Optional attachment
    attachment: {
      url: {
        type: String,
        default: null,
        trim: true,
      },
      publicId: {
        type: String,
        default: null,
        trim: true,
      },
      fileName: {
        type: String,
        default: null,
        trim: true,
      },
      mimeType: {
        type: String,
        default: null,
        trim: true,
      },
    },

    // Users who have read this message
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Message editing
    edited: {
      type: Boolean,
      default: false,
    },

    // Soft delete
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Message must contain either text or an attachment
messageSchema.pre("validate", function (next) {
  if (!this.content && !this.attachment?.url) {
    return next(new Error("Message must contain either content or an attachment."));
  }

  next();
});

messageSchema.index({ conversation: 1, createdAt: -1 });

export const Message = mongoose.model("Message", messageSchema);
