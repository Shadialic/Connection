import React from 'react'
import { Route, Routes } from "react-router-dom";
import Home from '../pages/UserPages/Home/Home';
import UserLogin from '../pages/UserPages/Login/UserLogin';
import SignupPage from '../pages/UserPages/Signup/SignupPage';
import ChatPage from '../pages/UserPages/Chat/ChatPage';
import Otp from '../components/Authentication/OtpPage';
import UserProtect from './protectRoute/UserProtect';


function UserRoutes() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/otp' element={<Otp/>}/>

            <Route path='/chats' element={<UserProtect><ChatPage/> </UserProtect> }/>

            <Route path='/login' element={<UserLogin/>}/>
            <Route path='/signup' element={<SignupPage/>}/>
        </Routes>

    </div>
  )
}

export default UserRoutes