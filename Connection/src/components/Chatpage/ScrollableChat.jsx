import React, { useEffect, useRef, useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { useChatState } from "../../context/ChatProvider";
import { TimeMange } from "../Authentication/TimeManagment";
import { DeleteMessage, EditingMessage } from "../../api/UserApi";
import toast from "react-hot-toast";

function ScrollableChat({ messages, fetchMessages }) {
  const scroll = useRef();
  const { user } = useChatState();
  const [deleteMessage, setDeleteMessage] = useState();
  const [editingMessage, setEditingMessage] = useState(null);
  const [newContent, setNewContent] = useState("");
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDelete = async (messageId) => {
    const response = await DeleteMessage(messageId);
    toast(response.message);
    setDeleteMessage(messageId);
  };

  useEffect(() => {
    if (deleteMessage) {
      fetchMessages();
    }
  }, [deleteMessage]);

  const handleEdit = (message) => {
    setEditingMessage(message);
    setNewContent(message.content);
    setContextMenu(null);
  };

  const handleKeyPress = async (e, messageId) => {
    if (e.key === "Enter") {
      const response = await EditingMessage({
        newContent,
        messageId,
      });
      toast(response.message);
      fetchMessages();
      setEditingMessage(null);
    }
  };

  const handleRightClick = (event, message) => {
    event.preventDefault();
    if (message.sender.id === user.id) {
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        message,
      });
    }
  };

  const handleClickOutside = (event) => {
    if (contextMenu) {
      setContextMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu]);

  return (
    <div className="h-screen overflow-y-auto p-4 pb-36 hidescroll" onContextMenu={(e) => e.preventDefault()}>
      <ScrollableFeed>
        {messages &&
          messages.map((m, i) => (
            <div
              className={`flex mb-4 cursor-pointer ${
                m.sender.id === user.id ? "justify-end" : "justify-start"
              }`}
              key={i}
              onContextMenu={(e) => handleRightClick(e, m)}
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
                } ${m.file && "flex flex-col "}`}
              >
                {m.file && <img src={m.file} alt="" className="w-36" />}
                {editingMessage?.id === m.id ? (
                  <input
                    type="text"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, m.id)}
                    autoFocus
                    className="bg-gray-400 rounded-lg p-2 text-black"
                  />
                ) : (
                  <p>{m.content}</p>
                )}
                <span className="flex justify-end items-end text-[10px] font-prompt-light pt-2">
                  {TimeMange(m.createdAt) === "NaN years ago"
                    ? "just now"
                    : TimeMange(m.createdAt)}
                </span>
              </div>
            </div>
          ))}
        <div ref={scroll}></div>
      </ScrollableFeed>
      {contextMenu && (
        <div
          style={{
            position: "absolute",
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
            background: "white",
            border: "1px solid gray",
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            zIndex: 1000,
            padding: "5px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleEdit(contextMenu.message)}
            className="block px-4 py-2 text-xs text-blue-500"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(contextMenu.message.id)}
            className="block px-4 py-2 text-xs text-red-500"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default ScrollableChat;
