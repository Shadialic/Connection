import React, { useState } from "react";
import {
  Box,
  Typography,
  Modal,
  Avatar,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { useChatState } from "../../context/ChatProvider";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import remove from "../../assets/removeicon.png";
import {
  SearchUsers,
  renameGroup,
  groupAdd,
  removeParticipant,
} from "../../api/UserApi"; 

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
};

function UpdateGroupChatModal({
  open,
  handleClose,
  setFetchAgain,
  fetchAgain,
  fetchMessages,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [renameLoading, setRenameLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = useChatState();

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      const response = await SearchUsers(query);
      if (response) {
        const data = response.slice(0, 3);
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(user)
        ? prevSelectedUsers.filter((u) => u !== user)
        : [...prevSelectedUsers, user]
    );
  };

  const handleRename = async () => {
    if (!groupName) {
      return;
    }
    setRenameLoading(true);

    const response = await renameGroup({
      ChatId: selectedChat.id,
      chatName: groupName,
    });
    setSelectedChat(response);
    setFetchAgain(!fetchAgain);
    fetchMessages();
    setRenameLoading(false);
    setGroupName("");
  };

  const handleAddUser = async (user) => {
    if (selectedChat.participants.find((u) => u.id === user.id)) {
      toast("User already in group");
    } else {
      const response = await groupAdd({
        ChatId: selectedChat.id,
        userId: user.id,
      });
      if (response) {
        setSelectedChat(response);
        setFetchAgain(!fetchAgain);
        toast("User added to group");
      } else {
        toast("Failed to add user to group");
      }
    }
  };

  const removeParticipants = async (participantId) => {
    if (selectedChat.adminId !== user.id && participantId !== user.id) {
      toast("Only admins can remove someone!");
    }
    const response = await removeParticipant({
      ChatId: selectedChat.id,
      userId: participantId,
    });
    if (response) {
      setSelectedChat(response);
      setFetchAgain(!fetchAgain);
      toast("User removed from group");
    } else {
      toast("Failed to remove user from group");
    }
  };

  const handleRemove = () => {
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
          id="modal-modal-title"
          variant="h6"
          component="h2"
          className="text-center"
        >
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
                  ":hover": {
                    backgroundColor: "#8338ec",
                    color: "#fff",
                  },
                }}
                className="rounded-md text-sm"
              >
                <div className="flex flex-row">
                  <h1>{participant.userName}</h1>
                  <img
                    className="w-6 cursor-pointer pl-2"
                    onClick={() => removeParticipants(participant.id)}
                    src={remove}
                    alt="Remove"
                  />
                </div>
              </Box>
            ))}
        </Box>
        <form action="" className="mb-2">
          <div className="mb-2">
            <div className="flex items-center mb-2">
              <TextField
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName}
                fullWidth
                label="Group Name"
                maxRows={1}
                className="mr-2"
              />
              <Button
                onClick={handleRename}
                variant="contained"
                className="bg-[#3a86ff] text-[#fff] p-2 h-14"
                size="medium"
                disabled={renameLoading}
              >
                {renameLoading ? "Updating..." : "Update"}
              </Button>
            </div>
            <TextField
              fullWidth
              label="Add User to Group"
              onChange={handleSearchChange}
              maxRows={1}
            />
          </div>
        </form>
        <List>
          {searchResults &&
            searchResults.map((user) => (
              <ListItem
                className="hover:bg-[#8338ec] hover:text-[#fff] rounded-md"
                key={user.id}
                onClick={() => handleAddUser(user)}
              >
                <ListItemAvatar>
                  <Avatar src={user.avatar} />
                </ListItemAvatar>
                <div className="flex flex-1 items-center justify-between ">
                  <div className="flex flex-col">
                    <ListItemText primary={user.userName} />
                    <ListItemText primary={user.email} className="text-sm" />
                  </div>
                </div>
              </ListItem>
            ))}
        </List>
        <Button
          onClick={handleRemove}
          variant="contained"
          className="bg-[#bc4749] text-[#fff] p-4"
          size="medium"
        >
          Leave Group
        </Button>
        <Toaster />
      </Box>
    </Modal>
  );
}

export default UpdateGroupChatModal;
