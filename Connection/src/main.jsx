import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ChatProvider from "./context/ChatProvider.jsx";

const clientId = "65151939969-bfrlg8dlrm3c5baiu9nbaeohb5f72hev.apps.googleusercontent.com"
console.log(clientId, "-3-3-");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <ChatProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <App />
        </GoogleOAuthProvider>
      </ChatProvider>
    </Router>
  </React.StrictMode>
);
