import React, { useEffect, useRef, useState } from "react";
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
import Lottie from "react-lottie";
import animationData from "../../animations/typin.json";

const ENDPOINT = "http://localhost:3000"; // Update this to your actual endpoint

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    useChatState();
  const [openProfile, setOpenProfile] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedChatCompare, setSelectedChatCompare] = useState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);
    newSocket.emit("setup", user);
    newSocket.on("connected", () => {
      console.log("Socket connected");
    });

    newSocket.on("typing", () => setIsTyping(true));
    newSocket.on("stop typing", () => setIsTyping(false));

    return () => newSocket.disconnect();
  }, [user]);

  useEffect(() => {
    if (selectedChat && socket) {
      fetchMessages();
      setSelectedChatCompare(selectedChat);
      socket.emit("join chat", selectedChat.id);
    }
  }, [selectedChat, socket]);

  useEffect(() => {
    if (socket) {
      socket.on("message received", (newMessageReceived) => {
        if (
          !selectedChatCompare ||
          selectedChatCompare.id !== newMessageReceived.chat.id
        ) {
          if (!notification.includes(newMessageReceived)) {
            setNotification([newMessageReceived, ...notification]);
            setFetchAgain(!fetchAgain);
          }
        } else {
          setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
        }
      });
      return () => {
        socket.off("message received");
      };
    }
  }, [socket, selectedChatCompare]);
 
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const response = await getAllMessages(selectedChat.id);
      setMessages(response);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim()) {
      socket.emit("stop typing", selectedChat.id);
      const response = await sendNewMessage({
        content: newMessage,
        chatId: selectedChat.id,
      });
      setNewMessage("");
      if (socket) {
        socket.emit("new message", response);
      }
      setMessages((prevMessages) => [...prevMessages, response]);
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socket) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat.id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat.id);
        setTyping(false);
      }
    }, timerLength);
  };

  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  const handleOpenProfile = () => {
    setOpenProfile(true);
  };

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
                  <Profile
                    user={getSenderFull(user, selectedChat.participants)}
                  />
                </>
              ) : (
                <>
                  <div className="w-full text-end">
                    <UpdateGroupChatModal
                      open={openProfile}
                      handleClose={handleCloseProfile}
                      setFetchAgain={setFetchAgain}
                      fetchAgain={fetchAgain}
                      fetchMessages={fetchMessages}
                    />
                    <IconButton
                      className="text-end"
                      onClick={handleOpenProfile}
                    >
                      <RemoveRedEyeIcon />
                    </IconButton>
                  </div>
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
              {isTyping ? (
                <div>
                  <Lottie options={defaultOptions} width={70} />
                </div>
              ) : (
                <div className="w-full flex justify-end items-end fixed bottom-0 bg-white p-3">
                  <Grid container className="w-full">
                    <Grid item xs={7}>
                      <TextField
                        id="outlined-basic-email"
                        label="Type Something"
                        value={newMessage}
                        fullWidth
                        onChange={typingHandler}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") sendMessage();
                        }}
                      />
                    </Grid>
                    <Grid item xs={1} className="pl-2">
                      <Fab
                        color="primary"
                        aria-label="add"
                        onClick={sendMessage}
                      >
                        <SendIcon />
                      </Fab>
                    </Grid>
                  </Grid>
                </div>
              )}
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
