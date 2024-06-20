import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
// Create context
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedChat,setSelectedChat]=useState()
  const [Chats,setChats]=useState([])

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      
      try {
        const userInfo = jwtDecode(token);
        // JSON.parse(atob(token.split('.')[1]));
        console.log(userInfo,'----------'); // This decodes the JWT payload
        setUser(userInfo);
      } catch (error) {
        console.error("Invalid token format");
        localStorage.removeItem('token'); // Clean up invalid token
        // navigate('/login');
      }
    } else {
      // navigate('/login');
    }
  }, [navigate]);

  return (
    <ChatContext.Provider value={{ user, setUser ,selectedChat,setSelectedChat,Chats,setChats}}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the ChatContext
export const useChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
