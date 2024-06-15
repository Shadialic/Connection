import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Create context
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Decode the JWT to get user info, or fetch user info from server
      // Assuming the user information is in the token payload
      try {
        const userInfo = JSON.parse(atob(token.split('.')[1])); // This decodes the JWT payload
        setUser(userInfo);
      } catch (error) {
        console.error("Invalid token format");
        localStorage.removeItem('token'); // Clean up invalid token
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <ChatContext.Provider value={{ user, setUser }}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the ChatContext
export const useChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
