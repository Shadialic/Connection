import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useChatState } from "../../context/ChatProvider";
import { TextField, Avatar, List, ListItem, ListItemAvatar, ListItemText, IconButton, Checkbox } from "@mui/material";
import { FormControl } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CreateGroup } from "../../api/UserApi";
import toast, { Toaster } from "react-hot-toast";


function UpdateGroupChatModal({ open, handleClose }) {
  const { user, selectedChat, setSelectedChat,messages } = useChatState();
  const [groupName, setGroupName] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [groupImage, setGroupImage] = React.useState(null);


  return (
    <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        {user ? user.userName : "Your Name"}
      </Typography>
      <img src={user.picture ? user.picture : placeholderImage} alt="" />
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        {user ? user.email : "Your Name"}
      </Typography>
    </Box>
  </Modal>
  )
}

export default UpdateGroupChatModal