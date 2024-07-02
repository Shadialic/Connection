import { Navigate } from "react-router-dom";
import React from "react";

function UserPublic(props) {
  if (localStorage.getItem("token")) {
    return <Navigate to="/chats" />;
  } else {
    <Navigate to="/login" />;
    return props.children;
  }
}

export default UserPublic;
