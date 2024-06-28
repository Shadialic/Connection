import React, { useState } from "react";
import { useChatState } from "../../../context/ChatProvider";
import Sidebar from "../../../components/Chatpage/Sidebar";
import MyChats from "../../../components/Chatpage/MyChats";
import ChatBox from "../../../components/Chatpage/ChatBox";

function ChatPage() {
  const { user } = useChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div className="flex w-svw h-svh">
      <div className="w-fit h-full">
        {user && (
          <Sidebar fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
      <div className="md:w-1/2 w-full  max-h-svh overflow-auto hidescroll ">
        {user && (
          <>
          <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </>
        )}
      </div>
      <div className="w-full hidden md:block max-h-svh overflow-auto hidescroll  ">
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
    </div>
  );
}

export default ChatPage;
