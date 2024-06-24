import React from "react";
import { useChatState } from "../../context/ChatProvider";
import NavBar from "../Layouts/NavBar";
import { Box } from "@mui/material";
import SingleChat from "./SingleChat";

function ChatBox({fetchAgain,setFetchAgain}) {
  const { selectedChat, setSelectedChat, Chats, setChats, user } =
    useChatState();
  return (
    <>
      <div className="flex flex-col w-full h-full">
        <NavBar />
        <Box
      
        >
          <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
        </Box>
      </div>
    </>
  );
}

export default ChatBox;