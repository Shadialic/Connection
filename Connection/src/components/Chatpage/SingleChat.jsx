import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useChatState } from "../../context/ChatProvider";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import Profile from "../modals/Profile";
import UpdateGroupChatModal from "../modals/UpdateGroupChatModal";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CircularProgress from "@mui/material/CircularProgress";
import Fab from "@mui/material/Fab";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import { getAllMessages, sendNewMessage } from "../../api/UserApi";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat } = useChatState();
  const [openProfile, setOpenProfile] = React.useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    // Setup socket and join user's room
    newSocket.emit("setup", user);
    newSocket.on("connected", () => console.log("Socket connected"));
    newSocket.on("message received", (newMessageReceived) => {
      if (selectedChat && selectedChat.id === newMessageReceived.chat.id) {
        setMessages([...messages, newMessageReceived]);
      }
    });

    return () => newSocket.disconnect(); // Clean up on unmount
  }, [selectedChat]);

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const response = await getAllMessages(selectedChat.id);
      setMessages(response);
      setLoading(false);
      socket.emit("join chat", selectedChat.id);
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim()) {
      const response = await sendNewMessage({
        content: newMessage,
        chatId: selectedChat.id,
      });
      setNewMessage("");
      socket.emit("new message", response);
      setMessages([...messages, response]);
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  const handleOpenProfile = () => {
    setOpenProfile(true);
  };
  console.log(selectedChat, "selectedChat");

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              paddingBottom: 3,
              paddingX: 2,
              fontFamily: "Work Sans",
              fontSize: { xs: "28px", md: "30px" },
            }}
          >
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  <Typography variant="h6">
                    {getSender(user, selectedChat.participants)}
                  </Typography>
                  <Profile
                    user={getSenderFull(user, selectedChat.participants)}
                  />
                </>
              ) : (
                <>
                  <Typography variant="h6">
                    {selectedChat.chatName.toUpperCase()}
                  </Typography>
                  <IconButton onClick={handleOpenProfile}>
                    <RemoveRedEyeIcon />
                  </IconButton>
                  <UpdateGroupChatModal
                    open={openProfile}
                    handleClose={handleCloseProfile}
                    setFetchAgain={setFetchAgain}
                    fetchAgain={fetchAgain}
                    fetchMessages={fetchMessages}
                  />
                </>
              ))}
          </Box>

          {loading ? (
            <div className="w-full h-full flex justify-center items-center">
              <CircularProgress size="xl" disableShrink />
            </div>
          ) : (
            <>
              <ScrollableChat messages={messages} />
              <div className="w-full flex justify-end items-end fixed bottom-0  bg-white p-3">
                <Grid container className="w-full">
                  <Grid item xs={7}>
                    <TextField
                      id="outlined-basic-email"
                      label="Type Something"
                      value={newMessage}
                      fullWidth
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") sendMessage(e);
                      }}
                    />
                  </Grid>
                  <Grid item xs={1} className="pl-2">
                    <Fab color="primary" aria-label="add" onClick={sendMessage}>
                      <SendIcon />
                    </Fab>
                  </Grid>
                </Grid>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="flex w-full h-full items-center justify-center">
          {!selectedChat && (
            <div className="text-center mt-60 text-2xl">
              <h1>Click on a user to start chatting</h1>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default SingleChat;
