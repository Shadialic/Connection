import { Router } from "express";
import {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChats,
  removeFromGroup,
  renameGroup,
} from "../controller/chatController.js";
const chatRouter = Router();

chatRouter.post("/", accessChat);
chatRouter.get("/", fetchChats);
chatRouter.post("/group", createGroupChat);
chatRouter.put("/rename", renameGroup);
chatRouter.put("/groupremove", removeFromGroup);
chatRouter.put("/groupadd", addToGroup);

export default chatRouter;
