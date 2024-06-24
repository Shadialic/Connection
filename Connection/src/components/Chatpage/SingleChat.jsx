import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useChatState } from "../../context/ChatProvider";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import Profile from "../modals/Profile";
import UpdateGroupChatModal from "../modals/UpdateGroupChatModal";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat, messages } = useChatState();
  const [openProfile, setOpenProfile] = React.useState(false);
  
  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  const handleOpenProfile = () => {
    setOpenProfile(true);
  };
console.log(selectedChat,'selectedChat');
  return (
    <>
      {selectedChat ? (
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
          {!messages &&
            (!selectedChat.isGroupChat ? (
              <>
                <Typography variant="h6">
                  {getSender(user, selectedChat.users)}
                </Typography>
                <Profile user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                <Typography variant="h6">
                  {/* {selectedChat.chatName.toUpperCase()} */}
                </Typography>
                <IconButton onClick={handleOpenProfile}>
                  <RemoveRedEyeIcon />
                </IconButton>
                <UpdateGroupChatModal
                  open={openProfile}
                  handleClose={handleCloseProfile}
                  setFetchAgain={setFetchAgain}
                  fetchAgain={fetchAgain}
                />
              </>
            ))}
        </Box>
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
