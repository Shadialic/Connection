import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ChatProvider from "./context/ChatProvider.jsx";

const clientId = import.meta.env.VITE_CLIENT_ID;
console.log(clientId, "-3-3-");
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChatProvider>
    <GoogleOAuthProvider>
      <App />
    </GoogleOAuthProvider>
    </ChatProvider>
  </React.StrictMode>
);
