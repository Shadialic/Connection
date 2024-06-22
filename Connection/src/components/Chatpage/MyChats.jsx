import React, { useEffect, useState } from "react";
import { TextField, IconButton } from "@material-ui/core";
import toast, { Toaster } from "react-hot-toast";
import {jwtDecode} from "jwt-decode"; 
import { SearchOutlined } from "@material-ui/icons";
import { useChatState } from "../../context/ChatProvider";
import { fetchingChats } from "../../api/UserApi";
import Box from "@mui/material/Box";
import { Button, Stack, Typography } from "@mui/material";
import ChatLoading from './ChatLoading';
import { getSender } from "../../config/ChatLogics";
import GroupchatModal from "../modals/GroupchatModal";

function MyChats({fetchAgain}) {
  const [loggerUser, setLoggetuser] = useState();
  const { selectedChat, setSelectedChat, Chats, setChats, user } = useChatState();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [openProfile, setOpenProfile] = React.useState(false);
  const handleCloseProfile = () => {
    setOpenProfile(false);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpenProfile = () => {
    setOpenProfile(true);
    handleClose();
  };

  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setLoggetuser(decodedUser);
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

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      padding={2}
      // width={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      className=" w-full h-full border-r-2  "
    >
      <div className="fixed w-fit z-20 ">
      <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={2} className='w-full'>
        <Typography variant="h5" className="font-prompt-semibold text-black text-2xl mb-4 p-4">
          My Chats
        </Typography>
        <Button onClick={handleOpenProfile} variant="contained" color="primary">Create New Group</Button>
      </Box>
      <TextField
      className="w-full"
        fullWidth
        id="standard-bare"
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
      </div>
      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bgcolor="#F8F8F8"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden"
        className='z-10'
      >
        {Chats ? (
          <Stack overflowY="scroll">
            {Chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bgcolor={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Typography>
                  {!chat.isGroupChat
                    ? getSender(loggerUser, chat.users)
                    : chat.chatName}
                </Typography>
                {chat.latestMessage && (
                  <Typography fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
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


