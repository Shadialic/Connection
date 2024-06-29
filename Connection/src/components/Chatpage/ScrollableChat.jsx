import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { useChatState } from "../../context/ChatProvider";
import { isLastMessage, isSameSender } from "../../config/ChatLogics";
import { Avatar, Tooltip, Typography } from "@mui/material";
import { TimeMange } from "../Authentication/TimeManagment";

function ScrollableChat({ messages }) {
  const { user } = useChatState();

  console.log(messages, "messages");
  return (
    <div className="h-screen overflow-y-auto p-4 pb-36">
      <ScrollableFeed>
        {messages &&
          messages.map((m, i) => (
            <div
              key={i}
              className={`flex mb-4 cursor-pointer ${
                m.sender.id === user.id ? "justify-end" : "justify-start"
              }`}
            >
              {m.sender.id !== user.id && (
                <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                  <img
                    src={m.sender.picture}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                </div>
              )}
              <div
                className={`flex max-w-96 rounded-lg p-3 gap-3 ${
                  m.sender.id === user.id
                    ? "bg-[#8338ec] text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                <p className="">{m.content}</p>
                <span className="flex justify-end items-end text-[10px] font-prompt-light pt-2 ">
                  {TimeMange(m.createdAt) == "NaN years ago"
                    ? "just now"
                    : TimeMange(m.createdAt)}
                </span>
              </div>
            </div>
          ))}
      </ScrollableFeed>
    </div>
  );
}

export default ScrollableChat;
