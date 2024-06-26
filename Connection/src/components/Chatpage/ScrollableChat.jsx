import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { useChatState } from "../../context/ChatProvider";
import { isLastMessage, isSameSender } from "../../config/ChatLogics";
import { Avatar, Tooltip, Typography } from "@mui/material";

function ScrollableChat({ messages }) {
  const { user } = useChatState();

  return (
    <div style={{ height: "70vh", overflowY: "auto" }}>
      <ScrollableFeed>
        {messages &&
          messages.map((m, i) => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
              {(isSameSender(messages, m, i, user.id) || isLastMessage(messages, i, user.id)) && (
                <Tooltip title={m.sender.name} placement="top">
                  <Avatar
                    alt={m.sender.userName}
                    src={m.sender.picture}
                    sx={{ width: 46, height: 46, marginRight: 10 }}
                  />
                </Tooltip>
              )}
              <Typography
                variant="body1"
                style={{
                  backgroundColor: m.sender.id === user.id ? "#8338ec" : "#fff",
                  color: m.sender.id === user.id ? "#fff" : "#000",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                {m.content}
              </Typography>
            </div>
          ))}
      </ScrollableFeed>
    </div>
  );
}

export default ScrollableChat;
