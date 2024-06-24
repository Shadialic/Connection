import React from "react";
import {
  Box,
  Typography,
  Modal,
  IconButton,
  Avatar,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useChatState } from "../../context/ChatProvider";
import { ListItemIcon } from "@mui/material";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  // display: "flex",
  // flexDirection: "column",
  // alignItems: "center",
};

function UpdateGroupChatModal({
  open,
  handleClose,
  setFetchAgain,
  fetchAgain,
}) {
  const { user, selectedChat } = useChatState();
  console.log(selectedChat, "selectedChat777777");

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
     <Box sx={style} className="te">
  <Typography id="modal-modal-title" variant="h6" component="h2" className='text-center'>
    {selectedChat ? selectedChat.chatName : "Group Name"}
  </Typography>

  <Box className="mt-6">
    {selectedChat &&
      selectedChat.participants &&
      selectedChat.participants.map((participant, index) => (
        <Box
          key={index}
          sx={{
            cursor: "pointer",
            bgcolor: "#8338ec",
            color: "white",
            borderRadius: "lg",
            display: "inline-block",
            p: 1,
            m: 1,
            ':hover': {
              backgroundColor: "#8338ec",
              color: "#fff",
            },
          }}
          className="rounded-md text-sm"
        >
          <div>
            <h1>{participant.userName}</h1>
            {/* <ListItem>
              <ListItemText className="w-fit h-fit" primary={participant.userName} />
              <ListItemIcon onClick={() => removeParticipant(index)} className="cursor-pointer pl-2">
                <GroupRemoveIcon />
              </ListItemIcon>
            </ListItem> */}
          </div>
        </Box>
      ))}
  </Box>
</Box>

    </Modal>
  );
}

export default UpdateGroupChatModal;
