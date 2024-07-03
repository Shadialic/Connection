import React, { useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Profile from "../modals/Profile";
import { useChatState } from "../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import Badge from "@mui/material/Badge";
import { getSender, getSenderImage } from "../../config/ChatLogics";
import LogoutIcon from '@mui/icons-material/Logout';
function NavBar() {
  const navigate = useNavigate();

  const [openGroup, setOpenGroup] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    useChatState();

  const open = Boolean(anchorEl);
  const notificationsOpen = Boolean(anchorElNotifications);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleNotificationsClick = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleNotificationsClose = () => {
    setAnchorElNotifications(null);
  };
  function notificationsLabel(count) {
    if (count === 0) {
      return "no notifications";
    }
    if (count > 99) {
      return "more than 99 notifications";
    }
    return `${count} notifications`;
  }
  const handleCloseGroup = () => {
    setOpenGroup(false);
  };

  const handleOpenGroup = () => {
    setOpenProfile(true);
  };
  const handleOpenProfile = () => {
    setOpenProfile(true);
    handleClose();
  };

  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  return (
    <div className="w-full">
      <div className="h-16 w-[89%] sm:w-[66%]  shadow-md flex justify-between items-center px-4 fixed top-0  right-0 bg-white z-50">
        {selectedChat && (
          <Avatar
            src={getSenderImage(user, selectedChat.participants)}
            sx={{ width: 46, height: 46 }}
          />
        )}

        <h1 className="font-prompt-semibold text-black text-2xl">
          {!selectedChat
            ? "Connections"
            : selectedChat.isGroupChat
            ? selectedChat.chatName
            : getSender(user, selectedChat.participants)}
        </h1>

        <div className="flex items-center">
          <IconButton
            aria-label={notificationsLabel(notification.length)}
            onClick={handleNotificationsClick}
          >
            <Badge badgeContent={notification.length} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Menu
            id="notifications-menu"
            anchorEl={anchorElNotifications}
            open={notificationsOpen}
            onClose={handleNotificationsClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            {!notification.length && (
              <MenuItem disabled>No new Messages</MenuItem>
            )}
            {notification &&
              notification.map((option, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    setSelectedChat(option.chat);
                    setNotification(notification.filter((n) => n !== option));
                  }}
                >
                  {option.chat.isGroupChat
                    ? `New Message in ${option.chat.chatName}`
                    : `New Message from ${getSender(
                        user,
                        option.chat.participants
                      )}`}
                </MenuItem>
              ))}
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
              <Avatar sx={{ width: 32, height: 32 }}>
                {user.userName.charAt(0)}
              </Avatar>
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
              <Avatar />
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout} >
              <LogoutIcon  />
             <span className='pl-2'> Logout</span>
            </MenuItem>
          </Menu>
        </div>
      </div>
      <Profile open={openProfile} handleClose={handleCloseProfile} />
    </div>
  );
}

export default NavBar;
