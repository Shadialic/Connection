import { Router } from "express";
import {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChats,
  removeFromGroup,
  renameGroup,
} from "../controller/chatController.js";
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const chatRouter = Router();

chatRouter.post("/users",accessChat);
chatRouter.get("/", fetchChats);
chatRouter.post("/group",upload.single('image'), createGroupChat);
chatRouter.put("/rename", renameGroup);
chatRouter.put("/groupremove", removeFromGroup);
chatRouter.put("/groupadd", addToGroup);

export default chatRouter;
