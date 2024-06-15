import React from 'react';
import { useChatState } from '../../../context/ChatProvider'; // Ensure this path is correct
import SideDrawer from '../../../components/Chatpage/SideDrawer';
import MyChats from '../../../components/Chatpage/MyChats';
import ChatBox from '../../../components/Chatpage/ChatBox';
import Sidebar from '../../../components/Chatpage/Sidebar';

function ChatPage() {
  const { user } = useChatState();
  return (
    <div className='flex w-screen '>
      {user && <Sidebar />}

      {/* {user && <SideDrawer />} */}
      {user&& <MyChats/>}
      {user&& <ChatBox/>}

    </div>
  );
}

export default ChatPage;
