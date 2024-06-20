import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useChatState } from "../../context/ChatProvider";
import { TextField, Avatar, List, ListItem, ListItemAvatar, ListItemText, IconButton, Checkbox } from "@mui/material";
import { FormControl } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function GroupchatModal({ open, handleClose }) {
  const [groupName, setGroupName] = React.useState("");
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [groupImage, setGroupImage] = React.useState(null);
  const { selectedChat, setSelectedChat, Chats, setChats, user } = useChatState();

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    // Mock search result, in real case, you would fetch this from an API
    if (e.target.value) {
      setSearchResult(users);
    } else {
      setSearchResult([]);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setGroupImage(e.target.files[0]);
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

  const handleSubmit = () => {
    // Handle form submission, e.g., send data to the backend
    const formData = new FormData();
    formData.append("groupName", groupName);
    formData.append("selectedUsers", JSON.stringify(selectedUsers));
    formData.append("groupImage", groupImage);

    // Here you would typically make an API call to create the group chat
    // Example: await api.createGroupChat(formData);

    console.log("Group Chat Created:", {
      groupName,
      selectedUsers,
      groupImage,
    });

    handleClose();
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
  };

  const users = [
    { id: 1, name: "User One", avatar: "https://via.placeholder.com/150" },
    { id: 2, name: "User Two", avatar: "https://via.placeholder.com/150" },
    { id: 3, name: "User Three", avatar: "https://via.placeholder.com/150" },
  ];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} overflow={scroll}>
        <Typography variant="h5" className="font-prompt-semibold text-black text-center text-2xl mb-4">
          Create Group Chat
        </Typography>
        <FormControl fullWidth>
          <TextField
            label="Group Name"
            id="group-name"
            value={groupName}
            onChange={handleGroupNameChange}
            size="small"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Search Users"
            id="search-users"
            value={search}
            onChange={handleSearchChange}
            size="small"
            fullWidth
            margin="normal"
          />
          <List>
            {searchResult.map((user) => (
              <ListItem key={user.id} button onClick={() => handleUserSelect(user)}>
                <ListItemAvatar>
                  <Avatar src={user.avatar} />
                </ListItemAvatar>
                <ListItemText primary={user.name} />
                <Checkbox
                  edge="end"
                  checked={selectedUsers.includes(user)}
                />
              </ListItem>
            ))}
          </List>
          <Box display="flex" alignItems="center" mt={2}>
            <Button variant="contained" component="label">
              Upload Image
              <input
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
                <Box key={user.id} display="flex" alignItems="center" m={1} p={1} bgcolor="#8c2bb9" borderRadius="8px">
                  {/* <Avatar src={user.avatar} /> */}
                  <Typography variant="body2" color="white" ml={1}>{user.name}</Typography>
                  <IconButton onClick={() => handleUserRemove(user)} size="small">
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
      </Box>
    </Modal>
  );
}

export default GroupchatModal;
