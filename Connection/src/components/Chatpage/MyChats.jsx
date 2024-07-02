import React, { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Badge from '@mui/material/Badge';
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useChatState } from "../../context/ChatProvider";
import { fetchingChats } from "../../api/UserApi";
import Box from "@mui/material/Box";
import { Avatar, Typography } from "@mui/material";
import ChatLoading from "./ChatLoading";
import {
  getNotificationCount,
  getSender,
  getSenderImage,
} from "../../config/ChatLogics";
import GroupchatModal from "../modals/GroupchatModal";

function MyChats({ fetchAgain }) {
  const {
    selectedChat,
    setSelectedChat,
    Chats,
    setChats,
    notification,
    setNotification,
  } = useChatState();
  const [loggerUser, setLoggerUser] = useState();
  const [openProfile, setOpenProfile] = useState(false);

  const fetchChats = async () => {
    try {
      const response = await fetchingChats();
      setChats(response);
    } catch (err) {
      toast.error("Fetching error!");
      console.log(err);
    }
  };

  useEffect(() => {
    const verify = async () => {
      const token = await localStorage.getItem("token");
      if (token) {
        try {
          const decodedUser = jwtDecode(token);
          setLoggerUser(decodedUser);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };
    verify();
    fetchChats();
  }, [fetchAgain]);

  const handleOpenProfile = () => setOpenProfile(true);
  const handleCloseProfile = () => setOpenProfile(false);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      padding={2}
      borderRadius="lg"
      borderWidth="1px"
      className={`w-full h-full border-r-2 ${selectedChat && "hidden"}`}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        mb={2}
        className="w-full"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="h5"
            className="font-prompt-semibold text-black text-2xl"
          >
            My Chats
          </Typography>
        </Box>

        <TextField
          id="standard-basic"
          label="serach users"
          variant="standard"
          className="border-[#76949f]"
        />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        bgcolor="#fff"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {Chats ? (
          Chats.map(
            (chat) =>
              chat && (
                <>
                  <div
                    key={chat.id}
                    className={`py-3 px-5 ${
                      selectedChat === chat
                        ? "bg-[#8338ec] text-white"
                        : "bg-white text-black"
                    } hover:bg-[#8338ec] hover:text-[#fff] rounded-md`}
                    onClick={() => {
                      setSelectedChat(chat);
                      setNotification(
                        notification.filter((n) => n.chatId !== chat.id)
                      );
                    }}
                  >
                    <div className="divide-y divide-gray-200">
                      <div className="flex items-center">
                        <Avatar
                          className="rounded-full items-start flex-shrink-0 mr-3"
                          src={
                            chat.isGroupChat
                              ? chat.groupImage
                              : getSenderImage(loggerUser, chat.participants)
                          }
                          width="32"
                          height="32"
                          alt="User Avatar"
                        />
                        <div className="w-full">
                          <h1 className="text-lg">
                            {!chat.isGroupChat
                              ? getSender(loggerUser, chat.participants)
                              : chat.chatName}{" "}
                            <span className="w-full flex justify-end items-end pr-2">
                              <Badge
                                badgeContent={getNotificationCount(
                                  chat,
                                  notification,
                                  loggerUser
                                )}
                                color="primary"
                              />{" "}
                            </span>
                          </h1>

                          <div className="text-[11px]">
                            {" "}
                            {chat.latestMessage && (
                              <>
                                <b>
                                  {chat.isGroupChat &&
                                    chat.latestMessage.sender.userName}
                                </b>{" "}
                                {chat.latestMessage.content.length > 50
                                  ? chat.latestMessage.content.substring(
                                      0,
                                      51
                                    ) + "..."
                                  : chat.latestMessage.content}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full border-b-2 border-gray-200"></div>
                </>
              )
          )
        ) : (
          <ChatLoading />
        )}
      </Box>
      <Toaster />
      <GroupchatModal open={openProfile} handleClose={handleCloseProfile} />
    </Box>
  );
}

export default MyChats;
