import React, { useState } from "react";
import { useChatState } from "../../../context/ChatProvider";
import MyChats from "../../../components/Chatpage/MyChats";
import ChatBox from "../../../components/Chatpage/ChatBox";
import Sidebar from "../../../components/Layouts/Sidebar";

function ChatPage() {
  const { user, selectedChat } = useChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className="flex w-svw h-svh">
      <div className="w-fit h-full">
        {user && (
          <Sidebar fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
      <div
        className={`w-full md:w-[45%] max-h-svh overflow-auto hidescroll ${
          selectedChat ? "hidden sm:block" : ""
        }`}
      >
        {user && (
          <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
      <div
        className={`w-full md:block max-h-svh overflow-auto hidescroll ${
          selectedChat ? "block" : "hidden sm:hidden"
        }`}
      >
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
    </div>
  );
}

export default ChatPage;
