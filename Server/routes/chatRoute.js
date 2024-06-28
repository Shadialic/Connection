import { Router } from "express";

import {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChats,
  removeFromGroup,
  renameGroup,
} from "../controller/chatController.js";
import { upload } from "../utils/Multer/multer.js";

const chatRouter = Router();

chatRouter.post("/users",accessChat);
chatRouter.get("/",fetchChats);

chatRouter.post("/group",upload.single('image'),createGroupChat);
chatRouter.put("/rename", renameGroup);
chatRouter.put("/groupremove",removeFromGroup);
chatRouter.put("/groupadd", addToGroup);

export default chatRouter;
