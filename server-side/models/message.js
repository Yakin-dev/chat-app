import mongoose, { Types } from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text:{type:String},
    image:{type:String},
    seen:{type:Boolean,default:false}
  },
  {
    timestamps: true,
  }
);

const Message = new mongoose.model("Message", messageSchema);
export default Message;
