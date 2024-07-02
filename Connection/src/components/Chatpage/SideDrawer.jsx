import React, { useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ChatLoading from "./ChatLoading";
import { LoadUser, SearchUsers } from "../../api/UserApi";
import { useChatState } from "../../context/ChatProvider";
import toast, { Toaster } from "react-hot-toast";
import { Avatar } from "@mui/material";

function SideDrawer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState();
  const [loading, setLoading] = useState(false);
  const {setSelectedChat, Chats, setChats } = useChatState();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClick = async () => {
    if (!searchQuery) {
      toast("Please Enter something in search");
    }
    const response = await SearchUsers(searchQuery);
    setLoading(true);
    setTimeout(() => {
      setSearchResults(response);
      setLoading(false);
    }, 1000);
  };

  const accessChat = async (userid) => {
    try {
      setLoading(true);
      const response = await LoadUser(userid);
      if (!Chats.find((c) => c.id === response.id)) {
        setChats([response, ...Chats]);
      }
      setSelectedChat(response);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const list = () => (
    <Box sx={{ width: 350 }} role="presentation">
      <h1 className="p-2 font-prompt-semibold">Search Users</h1>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search name or email"
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearchClick}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ my: 2 }}
      />
      <Divider />
      {loading ? (
        <ChatLoading />
      ) : (
        <List>
          {searchResults &&
            searchResults.map((user) => (
              <ListItem key={user.id} disablePadding>
                <ListItemButton onClick={() => accessChat(user.id)}>
                  {user.picture ? (
                    <Avatar
                      alt="Remy Sharp"
                      src={user.picture}
                      sx={{ width: 46, height: 46 }}
                    />
                  ) : (
                    <ListItemIcon>
                      <AccountCircleIcon />
                    </ListItemIcon>
                  )}
                  <div className="flex flex-col pl-2">
                    <ListItemText primary={user.userName} p={4} pl={2} />
                    <h1 primary={user.email} p={4} className="text-[10px]" />
                    <h1 className="text-[13px]">{user.email}</h1>
                  </div>
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      )}
      <Toaster />
    </Box>
  );
  return list();
}

export default SideDrawer;
