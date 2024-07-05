import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  CircularProgress,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import InputEmoji from "react-input-emoji";
import MicIcon from "@mui/icons-material/Mic";
import { useChatState } from "../../context/ChatProvider";
import { getSenderFull } from "../../config/ChatLogics";
import Profile from "../modals/Profile";
import UpdateGroupChatModal from "../modals/UpdateGroupChatModal";
import { getAllMessages, sendNewMessage } from "../../api/UserApi";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
// import Lottie from "react-lottie";
import animationData from "../../animations/typin.json";
// import { ReactMic } from "react-mic";
import axios from "axios";
import { uploadToCloudinary } from "../../utils/cloudnery/Cloudnery";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ENDPOINT = import.meta.env.VITE_BASEURL;
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
  const [record, setRecord] = useState(false);
  const [audioData, setAudioData] = useState(null);
  const [selectedChatCompare, setSelectedChatCompare] = useState();
  const [files, setFiles] = useState();

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
  }, [socket, selectedChatCompare, files]);

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

  const handleFile = async (e) => {
    const file = e.target.files[0];
    const data = await uploadToCloudinary(file);
    setFiles(data.url);
  };

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (newMessage.trim() || files) {
      socket.emit("stop typing", selectedChat.id);
      try {
        const response = await sendNewMessage({
          content: newMessage,
          chatId: selectedChat.id,
          file: files,
        });
        setFiles("");
        setNewMessage("");
        if (socket) {
          socket.emit("new message", response);
        }
        setMessages((prevMessages) => [...prevMessages, response]);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  const typingHandler = (e) => {
    if (!e || !e.target) return;

    const { value } = e.target;
    setNewMessage(value);

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

  const startRecording = (recordedBlob) => {
    setRecord(true);
    console.log("chunk of real-time data is: ", recordedBlob);
  };

  const stopRecording = (recordedBlob) => {
    setRecord(false);
    setAudioData(recordedBlob);
    console.log("recordedBlob is: ", recordedBlob);
  };

  const onStopRecording = async (recordedBlob) => {
    const formData = new FormData();
    formData.append("audio", recordedBlob.blob, "voiceNote.webm");

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newVoiceMessage = {
        content: response.data.filePath,
        chatId: selectedChat.id,
        type: "audio",
      };

      const savedMessage = await sendNewMessage(newVoiceMessage);
      if (socket) {
        socket.emit("new message", savedMessage);
      }
      setMessages((prevMessages) => [...prevMessages, savedMessage]);
    } catch (error) {
      console.error("Error uploading voice note:", error);
    }
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
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  <Profile
                    user={getSenderFull(user, selectedChat.participants)}
                  />
                </>
              ) : (
                <>
                  <div className="w-full text-end ">
                    <UpdateGroupChatModal
                      open={openProfile}
                      handleClose={handleCloseProfile}
                      setFetchAgain={setFetchAgain}
                      fetchAgain={fetchAgain}
                      fetchMessages={fetchMessages}
                    />
                    <IconButton
                      className="text-end z-40 fixed top-14"
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
              <ScrollableChat
                messages={messages}
                fetchMessages={fetchMessages}
              />
              {isTyping ? (
                <div>
                  {/* <Lottie options={defaultOptions} width={70} /> */}
                </div>
              ) : (
                <>
                  {files && (
                    <>
                      <div className="flex items-start">
                        <img
                          src={files}
                          alt="Image description"
                          className="w-1/2 mr-2"
                        />
                        <CloseIcon onClick={() => setFiles("")} />
                      </div>
                    </>
                  )}

                  <div className="w-full flex justify-end items-end fixed bottom-0 bg-white p-3">
                    <Grid container className="w-full">
                      <Grid item xs={12}>
                        {record ? (
                          // <ReactMic
                          //   record={record}
                          //   className="sound-wave w-[20%]"
                          //   onStop={onStopRecording}
                          //   strokeColor="#000000"
                          //   backgroundColor="#FF4081"
                          // />
                          <></>
                        ) : (
                          <form
                            className="w-[90%] sm:w-[65%]"
                            onSubmit={sendMessage}
                          >
                            <label htmlFor="chat" className="sr-only">
                              Your message
                            </label>

                            <div className="flex w-full items-center py-2 px-3 bg-gray-50 rounded-lg dark:bg-gray-700">
                              <label
                                htmlFor="file-upload"
                                className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                              >
                                <input
                                  onChange={handleFile}
                                  id="file-upload"
                                  type="file"
                                  className="hidden"
                                />
                                <svg
                                  className="w-6 h-6"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                              </label>
                              <InputEmoji
                                value={newMessage}
                                onChange={(e) =>
                                  typingHandler({ target: { value: e } })
                                }
                                cleanOnEnter
                                onEnter={(e) => sendMessage(e)}
                              />

                              <IconButton
                                onClick={() => setRecord(!record)}
                                sx={{ color: "primary.main", mr: 1 }}
                              >
                                <MicIcon />
                              </IconButton>
                              <button
                                type="submit"
                                className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
                              >
                                <svg
                                  className="w-6 h-6 rotate-90"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                                </svg>
                              </button>
                            </div>
                          </form>
                        )}
                      </Grid>
                    </Grid>
                  </div>
                </>
              )}
            </>
          )}
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
          className="mt-24"
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "20px", md: "28px" },
            }}
          >
            Select a chat to start messaging
          </Typography>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
