import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faCog, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import call from '../../../public/icons/call.png'
import users from '../../../public/icons/users.png'
import setting from '../../../public/icons/setting.png'
import all from '../../../public/icons/icons8-border-all-48 (1).png'
import Avatar from '@mui/material/Avatar';
function Sidebar() {
  return (
    <div className="w-16 bg-black h-screen flex flex-col items-center py-4">
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
        <img src={users} alt="Users" className="w-6 my-5" />
        <img src={call} alt="Call" className="w-6 my-5" />
        <img src={setting} alt="Setting" className="w-6 my-5" />
      </div>
    </div>
  </div>
);
}

export default Sidebar;
