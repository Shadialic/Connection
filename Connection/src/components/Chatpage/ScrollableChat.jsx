import React, { useEffect, useRef, useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { useChatState } from "../../context/ChatProvider";
import { TimeMange } from "../Authentication/TimeManagment";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { DeleteMessage, EditingMessage } from "../../api/UserApi";
import toast from "react-hot-toast";

function ScrollableChat({ messages ,fetchMessages}) {
  const scroll = useRef();
  const { user } = useChatState();
  const [deleteMessage,setDeleteMessage]=useState()
  const [editingMessage, setEditingMessage] = useState(null);
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDelete = async(messageId) => {
    const response=await DeleteMessage(messageId)
    toast(response.message)
    setDeleteMessage(messageId)
  };
  useEffect(()=>{
    if(deleteMessage){
       fetchMessages()
    }
  },[deleteMessage])

  const handleEdit = (message) => {
    setEditingMessage(message);
    setNewContent(message.content);
  };

  // const handleSaveEdit = (messageId) => {
  //   onEditMessage(messageId, newContent);
  //   setEditingMessage(null);
  // };

  const handleKeyPress =async(e, messageId) => {
    if (e.key === "Enter") {
      const response=await EditingMessage({
        newContent,
        messageId
      })
      toast(response.message)
      fetchMessages()
      // handleSaveEdit(messageId);
    }
  };

  return (
    <div className="h-screen overflow-y-auto p-4 pb-36 hidescroll">
      <ScrollableFeed>
        {messages &&
          messages.map((m, i) => (
            <ContextMenuTrigger id={`contextmenu-${m.id}`} key={i}>
              <div
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
                  } ${m.file && "flex flex-col "}`}
                >
                  {m.file && <img src={m.file} alt="" className="w-36" />}
                  {editingMessage?.id === m.id ? (
                    <input
                      type="text"
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      // onBlur={() => handleSaveEdit(m.id)}
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
              <ContextMenu id={`contextmenu-${m.id}`}>
                {!m.deleted && (
                  <div className='bg-gray-200 p-2 shadow-md'>
                    <MenuItem key={`edit-${m.id}`} onClick={() => handleEdit(m)} className="cursor-pointer">Edit</MenuItem>
                    <MenuItem key={`delete-${m.id}`} onClick={() => handleDelete(m.id)} className="cursor-pointer">Delete</MenuItem>
                  </div>
                )}
              </ContextMenu>
            </ContextMenuTrigger>
          ))}
        <div ref={scroll}></div>
      </ScrollableFeed>
    </div>
  );
}

export default ScrollableChat;
