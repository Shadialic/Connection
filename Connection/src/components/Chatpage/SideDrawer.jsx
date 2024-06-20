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
import { LoadUser } from "../../api/UserApi";
import { useChatState } from "../../context/ChatProvider";

function SideDrawer({ toggleDrawer }) {
  const users = [
    { id: 1, name: "User One" },
    { id: 2, name: "User Two" },
    { id: 3, name: "User Three" },
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(users);
  const [loading, setLoading] = useState(false);
  const {selectedChat,setSelectedChat,Chats,setChats}=useChatState()

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClick = () => {
    setLoading(true);
    setTimeout(() => {
      const results = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setLoading(false);
    }, 1000); 
  };

  const accessChat=async(userid)=>{
    try{
      setLoading(true);
      const response=await LoadUser(userid)
      if(!Chats.find((c)=>c.id===response.id)){
        setChats([response,...Chats])
      }
      setSelectedChat(response)
      setLoading(false);

    }catch(err){
      console.log(err);
    }
  }

  const list = () => (
    <Box sx={{ width: 250 }} role="presentation">
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
          {searchResults.map((user) => (
            <ListItem key={user.id} disablePadding>
              <ListItemButton onClick={() => accessChat(user.id)}>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary={user.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );

  return list();
}

export default SideDrawer;
