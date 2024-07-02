import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useChatState } from "../../context/ChatProvider";
import {
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Checkbox,
} from "@mui/material";
import { FormControl } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CreateGroup, SearchUsers } from "../../api/UserApi";
import toast, { Toaster } from "react-hot-toast";
import { uploadToCloudinary } from "../../utils/cloudnery/Cloudnery";

function GroupchatModal({ open, handleClose }) {
  const [groupName, setGroupName] = React.useState("");
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);
  const [groupImage, setGroupImage] = React.useState(null);
  const { Chats, setChats, user } = useChatState();

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };
  const handleSearchChange = async (e) => {
    setSearch(e.target.value);
    const response = await SearchUsers(e.target.value);
    if (response) {
      const data = response.slice(0, 3);
      setSearchResult(data);
    } else {
      setSearchResult([]);
    }
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const data = await uploadToCloudinary(file);
      setGroupImage(data.url);
    }
  };

  const handleUserSelect = (user) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== user));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleUserRemove = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u !== user));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName || !groupImage || selectedUsers.length === 0) {
      toast.error("Please fill all the fields");
    } else if (selectedUsers.length < 2) {
      toast.error("Add at least two members");
    } else {
      const response = await CreateGroup({
        chatName: groupName,
        users: JSON.stringify(selectedUsers),
        groupPhoto: groupImage,
      });
      setChats([response, ...Chats]);
      toast.success("New Group Chat Created!");
      setGroupName("");
      setSelectedUsers([]);
      handleClose();
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    maxHeight: "90vh",
    overflow: "auto",
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          variant="h5"
          className="font-prompt-semibold text-black text-center text-2xl mb-4"
        >
          Create Group Chat
        </Typography>
        <FormControl fullWidth>
          <TextField
            label="Group Name"
            id="groupName"
            value={groupName}
            onChange={handleGroupNameChange}
            size="small"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Search Users"
            id="selectedUsers"
            value={search}
            onChange={handleSearchChange}
            size="small"
            fullWidth
            margin="normal"
          />
          <List>
            {searchResult.map((user) => (
              <ListItem
                key={user.id}
                button
                onClick={() => handleUserSelect(user)}
              >
                <ListItemAvatar>
                  <Avatar src={user.avatar} />
                </ListItemAvatar>
                <div className="flex flex-1 items-center justify-between">
                  <div className="flex flex-col">
                    <ListItemText primary={user.userName} />
                    <ListItemText primary={user.email} className="text-sm" />
                  </div>
                  <Checkbox edge="end" checked={selectedUsers.includes(user)} />
                </div>
              </ListItem>
            ))}
          </List>
          <Box display="flex" alignItems="center" mt={2}>
            <Button variant="contained" component="label">
              Upload Image
              <input
                id="groupImage"
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {groupImage && (
              <Typography variant="body2" ml={2}>
                {groupImage.name}
              </Typography>
            )}
          </Box>
          <Box mt={2}>
            <Typography variant="h6">Selected Users:</Typography>
            <Box display="flex" flexWrap="wrap">
              {selectedUsers.map((user) => (
                <Box
                  key={user.id}
                  display="flex"
                  alignItems="center"
                  m={1}
                  p={1}
                  bgcolor="#8c2bb9"
                  borderRadius="8px"
                >
                  <Avatar src={user.avatar} />
                  <Typography variant="body2" color="white" ml={1}>
                    {user.userName}
                  </Typography>
                  <IconButton
                    onClick={() => handleUserRemove(user)}
                    size="small"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            sx={{ mt: 3 }}
          >
            Create Group
          </Button>
        </FormControl>
        <Toaster />
      </Box>
    </Modal>
  );
}

export default GroupchatModal;
