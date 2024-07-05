import React from 'react'
import { Route, Routes } from "react-router-dom";
import UserLogin from '../pages/UserPages/Login/UserLogin';
import SignupPage from '../pages/UserPages/Signup/SignupPage';
import ChatPage from '../pages/UserPages/Chat/ChatPage';
import Otp from '../components/Authentication/OtpPage';
import UserProtect from './protectRoute/UserProtect';
import UserPublic from './protectRoute/UserPublic';


function UserRoutes() {
  return (
    <div>
        <Routes>
            <Route path='/otp' element={<UserPublic><Otp/></UserPublic>}/>
            <Route path='/' element={<UserProtect><ChatPage/> </UserProtect> }/>
            <Route path='/login' element={<UserPublic><UserLogin/></UserPublic>}/>
            <Route path='/signup' element={<UserPublic><SignupPage/></UserPublic>}/>
        </Routes>

    </div>
  )
}

export default UserRoutes