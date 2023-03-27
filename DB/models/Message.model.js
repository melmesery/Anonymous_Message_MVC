import mongoose, { model, Schema, Types } from "mongoose";

const messageSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.models.Message || model("Message", messageSchema);

export default messageModel;
