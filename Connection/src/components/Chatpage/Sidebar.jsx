import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import SideDrawer from './SideDrawer';

import call from '../../../public/icons/call.png';
import users from '../../../public/icons/users.png';
import setting from '../../../public/icons/setting.png';
import all from '../../../public/icons/icons8-border-all-48 (1).png';

function Sidebar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <div className="w-20 bg-black h-screen flex flex-col items-center py-4">
      <div className="flex flex-col items-center justify-between h-full ">
        <div className="mb-4">
          <Avatar
            alt="Remy Sharp"
            src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
            sx={{
              width: 40,
              height: 40,
              backgroundColor: '#8338ec', 
              borderRadius: 'full', 
            }}
          />
        </div>
        <div className="flex-grow flex flex-col items-center justify-center">
          <img src={all} alt="All" className="w-6 my-5" />
          <img src={users} alt="Users" className="w-6 my-5 cursor-pointer" onClick={toggleDrawer(true)} />
          <img src={call} alt="Call" className="w-6 my-5" />
          <img src={setting} alt="Setting" className="w-6 my-5" />
        </div>
      </div>
      <Drawer
        anchor={'left'}
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <SideDrawer toggleDrawer={toggleDrawer} />
      </Drawer>
    </div>
  );
}

export default Sidebar;
