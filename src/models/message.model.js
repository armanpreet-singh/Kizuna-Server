import mongoose from "mongoose";
import { MESSAGE_TYPES, MESSAGE_LIMITS } from "../constants/index.js";

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    messageType: {
      type: String,
      enum: Object.values(MESSAGE_TYPES),
      default: MESSAGE_TYPES.TEXT,
      required: true,
    },

    content: {
      type: String,
      trim: true,
      maxlength: MESSAGE_LIMITS.CONTENT_MAX,
      default: "",
    },

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

    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    edited: {
      type: Boolean,
      default: false,
    },

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

messageSchema.pre("validate", function () {
  if (this.deleted) {
    return;
  }

  if (!this.content && !this.attachment?.url) {
    throw new Error("Message must contain either content or an attachment.");
  }
});

messageSchema.index({ conversation: 1, createdAt: -1 });

export const Message = mongoose.model("Message", messageSchema);
