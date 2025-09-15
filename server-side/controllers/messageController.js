import User from "../models/user.js";
import Message from "../models/message.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

//get all users except logged user
export const getAllUnseenMessage = async (req, res) => {
  try {
    const clientId = req.user._id;
    const filteredUser = await User.find({ _id: { $ne: clientId } }).select(
      "-password"
    );
    const unseenMessage = {};
    //count on unseen message
    const promises = filteredUser.map(async (user) => {
      const message = await User.find({
        sender: user._id,
        receiver: clientId,
        seen: false,
      });
      if (message.length > 0) {
        unseenMessage[user._id] = message.length;
      }
    });
    await Promise.all(promises);
    res.json({ success: true, users: filteredUser, unseenMessage });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// get all message for selected user
export const getMessageForSelectedUser = async (req, res) => {
 try {
   const { id: selectedUser } = req.params;
   const userId = req.user._id;

   const getMessage = await Message.find({
     $or: [
       {
         sender: userId,
         receiver: selectedUser,
       },
       { sender: selectedUser,
         receiver: userId },
     ],
   });

   await Message.updateMany(
     { sender: userId, receiver: selectedUser },
     { seen: true }
   );
   res.json({ success: true, getMessage });
 } catch (error) {
  console.log(error);
  res.json({ success: false, message: error.message });
 }
};
//api to mark message as seen using message id
export const markMessage = async (req,res)=>{
  try {
    const {id} = req.params;
    await Message.findByIdAndUpdate(id,{seen:true});
    res.json({success:true})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
//api to send messages
export const sendMessage = async (req,res)=>{
    try {
       const {text, image} = req.body;
       const receiver = req.params.id;
       const sender = req.user._id;
       let imageUrl;
       if (image) {
         const uploadResponse = await cloudinary.uploader.upload(image);
         imageUrl = uploadResponse.secure_url;
       }
       const newMessage = await Message.create({
         receiver,
         sender,
         text,
         image: imageUrl,
       });
          //emmit messages to socket id
          const receiverSocketId = userSocketMap[receiver];
          if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
          }        
       res.json({
         success: true,
         newMessage,
         message: "Messages was created successfully",
       });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
}

