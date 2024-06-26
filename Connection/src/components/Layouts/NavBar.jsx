import React from "react";
import notification from "../../../public/icons/icons8-notification-24.png";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Profile from "../modals/Profile";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Box } from "@mui/material";
import { useChatState } from "../../context/ChatProvider";
import { useNavigate } from "react-router-dom";

function NavBar() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openProfile, setOpenProfile] = React.useState(false);
    const { selectedChat, setSelectedChat, Chats, setChats, user } =
    useChatState();
    const navigate=useNavigate()
  
    const open = Boolean(anchorEl);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleLogout = () => {
      localStorage.removeItem("token");
    navigate("/login");

    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const handleOpenProfile = () => {
      setOpenProfile(true);
      handleClose();
    };
  
    const handleCloseProfile = () => {
      setOpenProfile(false);
    };
  
    return (
      // <Box  sx={{
      //   display: { xs: selectedChat ? "flex" : "none", md: "flex" },
      //   alignItems: "center",
      //   flexDirection: "column",
      //   padding: 3,
      //   backgroundColor: "white",
      //   // width: { xs: "100%", md: "68%" },
      //   borderRadius: "8px", 
      //   borderWidth: "1px",
      //   borderStyle: "solid",
      //   borderColor: "divider",
      // }}
      // 
      // >
      <div className='w-[100%]'>

        {" "}
        {/* Centering the content with mx-auto */}
        <div className="h-16  shadow-md flex justify-between items-center px-4">
          {" "}
          {/* Added px-4 for padding */}
          <h1 className="font-prompt-semibold text-black text-2xl">
            Connections
          </h1>
          <div className="flex items-center">
            {" "}
            {/* Aligning items to the right */}
            <img
              onClick={handleClick}
              src={notification}
              alt="Notification"
              className="mr-2 w-5 cursor-pointer"
            />
            <Menu
              id="notification-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleOpenProfile}>
                <Avatar /> Profile
              </MenuItem>
  
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>{/* <Logout fontSize="small" /> */}</ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </div>
        <Profile open={openProfile} handleClose={handleCloseProfile} />
     </div>

    );
  }
  
  export default NavBar;
  