import React from 'react';
import { useChatState } from '../../../context/ChatProvider'; // Ensure this path is correct
import SideDrawer from '../../../components/Chatpage/SideDrawer';

function ChatPage() {
  const { user } = useChatState();
  return (
    <div>
      {user && <SideDrawer />}
    </div>
  );
}

export default ChatPage;
