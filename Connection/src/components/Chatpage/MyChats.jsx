import React, { useEffect, useState } from "react";
import { TextField, IconButton, Badge } from "@material-ui/core";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode"; // Remove the destructuring for default export
import { SearchOutlined } from "@material-ui/icons";
import { useChatState } from "../../context/ChatProvider";
import { fetchingChats } from "../../api/UserApi";
import Box from "@mui/material/Box";
import { Avatar, Button, Typography } from "@mui/material";
import ChatLoading from "./ChatLoading";
import {  getSender, getSenderImage } from "../../config/ChatLogics";
import GroupchatModal from "../modals/GroupchatModal";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ImageIcon from "@mui/icons-material/Image";
function MyChats({ fetchAgain }) {
  const [loggerUser, setLoggerUser] = useState();
  const { selectedChat, setSelectedChat, Chats, setChats, user,notification } =
    useChatState();
  console.log(Chats, "Chats");
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setLoggerUser(decodedUser);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    fetchChats();
  }, [fetchAgain]);

  const fetchChats = async () => {
    try {
      const response = await fetchingChats();
      setChats(response);
    } catch (err) {
      toast.error("Fetching error!");
      console.log(err);
    }
  };

  const handleOpenProfile = () => setOpenProfile(true);
  const handleCloseProfile = () => setOpenProfile(false);
  console.log(Chats, "ssssssssssssssssssss");

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      padding={2}
      borderRadius="lg"
      borderWidth="1px"
      className="w-full h-full border-r-2"
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
          <Button
            onClick={handleOpenProfile}
            variant="contained"
            color="primary"
          >
            Create New Group
          </Button>
        </Box>
        <TextField
          className="w-full"
          fullWidth
          variant="outlined"
          placeholder="Search Users"
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchOutlined />
              </IconButton>
            ),
          }}
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
          Chats.map((chat) => (
            //       <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            //         <ListItem>
            //   {/* <ListItemAvatar>
            //     <Avatar>
            //       <ImageIcon />
            //     </Avatar>
            //   </ListItemAvatar> */}
            //   <ListItemText primary="Photos" secondary="Jan 9, 2014" />
            // </ListItem>
            // </List>
            // <Box
            //   onClick={() => setSelectedChat(chat)}
            //   cursor="pointer"
            //   bgcolor={selectedChat === chat ? "#8338ec" : "#fff"}
            //   color={selectedChat === chat ? "white" : "black"}
            //   px={2}
            //   width="100%"
            //   py={2}
            //   borderWidth="2px"
            //   borderRadius="lg"
            //   key={chat._id}
            //   className="hover:bg-[#8338ec] w-full hover:text-[#fff] rounded-md flex  h-16 p-2 items-center"
            // >
            //   {chat.isGroupChat ? (
            //     <Avatar src={chat.groupImage} sx={{ width: 46, height: 46 }} />
            //   ) : (
            //     <Avatar
            //       src={getSenderImage(loggerUser, chat.participants)}
            //       sx={{ width: 46, height: 46 }}
            //     />
            //   )}
            <div
              className={`flex flex-row py-2 px-2 justify-center items-center ${
                selectedChat === chat
                  ? "bg-[#8338ec] text-white"
                  : "bg-white text-black"
              } hover:bg-[#8338ec] w-full hover:text-[#fff]  rounded-md`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className={`w-1/4 `}>
                {chat.isGroupChat ? (
                  <Avatar
                    src={chat.groupImage}
                    sx={{ width: 46, height: 46 }}
                  />
                ) : (
                  <Avatar
                    src={getSenderImage(loggerUser, chat.participants)}
                    sx={{ width: 46, height: 46 }}
                  />
                )}
              </div>
              <div className="w-full">
  <div className="text-lg font-semibold">
    {!chat.isGroupChat
      ? getSender(loggerUser, chat.participants)
      : chat.chatName}
  </div>
  <div className="flex justify-end items-end">
    {/* <Badge badgeContent={getNotification(loggerUser,notification,chat.participants)} color="primary" /> */}
  </div>
  <span
    className={`${
      selectedChat === chat
        ? "bg-[#8338ec] text-white"
        : "text-black"
    } hover:text-[#fff]`}
  >
    {chat.latestMessage && (
      <>
        <b>{chat.latestMessage.sender.name}:</b>{" "}
        {chat.latestMessage.content.length > 50
          ? chat.latestMessage.content.substring(0, 51) + "..."
          : chat.latestMessage.content}
      </>
    )}
  </span>
  
</div>

            </div>

            // </Box>
          ))
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
