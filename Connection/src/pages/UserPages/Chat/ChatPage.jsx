import React, { useState } from "react";
import { useChatState } from "../../../context/ChatProvider";
import MyChats from "../../../components/Chatpage/MyChats";
import ChatBox from "../../../components/Chatpage/ChatBox";
import Sidebar from "../../../components/Layouts/Sidebar";

function ChatPage() {
  const { user,selectedChat } = useChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div className="flex w-svw h-svh">
      <div className="w-fit h-full">
        {user && (
          <Sidebar fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
      <div className="md:w-[45%] w-full max-h-svh overflow-auto hidescroll ">
        {user && (
          <>
            <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </>
        )}
      </div>
      <div className={`w-full hidden md:block max-h-svh overflow-auto hidescroll `}>
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
    </div>
  );
}

export default ChatPage;
