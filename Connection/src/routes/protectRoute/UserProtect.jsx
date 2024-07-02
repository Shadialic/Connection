import { Navigate } from "react-router-dom";
import React from "react";
import { useChatState } from "../../context/ChatProvider";

function UserProtect({ children }) {
  const { user } = useChatState();
  if (localStorage.getItem("token")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default UserProtect;
