import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SideDrawer from '../Chatpage/SideDrawer';
import call from '../../../public/icons/call.png';
import users from '../../../public/icons/users.png';
import setting from '../../../public/icons/setting.png';
import all from '../../../public/icons/icons8-border-all-48 (1).png';
import { useChatState } from '../../context/ChatProvider';
import Profile from '../modals/Profile';
import GroupchatModal from '../modals/GroupchatModal';

function Sidebar() {
  const { user } = useChatState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [openGroup, setOpenGroup] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleOpenProfile = () => {
    setOpenProfile(true);
    handleCloseMenu();
  };

  const handleOpenGroupChat = () => {
    setOpenGroup(true);
    handleCloseMenu();
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  const handleCloseGroupChat = () => {
    setOpenGroup(false);
  };

  return (
    <div className="w-full h-full p-2 bg-black flex flex-col items-center py-4">
      <div className="flex flex-col items-center justify-between h-full">
        <div className="mb-4">
          <Avatar
            onClick={handleOpenProfile}
            alt="Remy Sharp"
            src={user.picture}
            sx={{
              width: 40,
              height: 40,
              backgroundColor: '#8338ec',
              borderRadius: 'full',
            }}
          />
        </div>
        <div className="flex-grow flex flex-col items-center justify-center">
          <img src={all} alt="All" className="w-6 my-5 hover:w-8" onClick={handleClickMenu} />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem className="p-2" onClick={handleOpenGroupChat}>Create New Group Chat</MenuItem>
          </Menu>
          <img src={users} alt="Users" className="w-6 my-5 cursor-pointer hover:w-8" onClick={toggleDrawer(true)} />
          <img src={call} alt="Call" className="w-6 my-5 hover:w-8" />
          <img src={setting} alt="Setting" className="w-6 my-5 hover:w-8" />
        </div>
      </div>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <SideDrawer toggleDrawer={toggleDrawer} />
      </Drawer>
      <Profile open={openProfile} handleClose={handleCloseProfile} />
      <GroupchatModal open={openGroup} handleClose={handleCloseGroupChat} />
    </div>
  );
}

export default Sidebar;
