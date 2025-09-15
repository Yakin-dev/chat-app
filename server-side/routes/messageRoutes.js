import express from "express";
import protectedRoute from "../middleware/auth.js";
import { getAllUnseenMessage, getMessageForSelectedUser, markMessage, sendMessage } from "../controllers/messageController.js";




const messageRouter = express.Router();
  messageRouter.get("/users",protectedRoute,getAllUnseenMessage);
  messageRouter.get("/:id",protectedRoute,getMessageForSelectedUser);
  messageRouter.put("/mark/:id",protectedRoute,markMessage);
  messageRouter.post("/send/:id",protectedRoute,sendMessage);

export default messageRouter;
