import React from 'react'
import { Route, Routes } from "react-router-dom";
import Home from '../pages/UserPages/Home/Home';
import UserLogin from '../pages/UserPages/Login/UserLogin';
import SignupPage from '../pages/UserPages/Signup/SignupPage';
import ChatPage from '../pages/UserPages/Chat/ChatPage';


function UserRoutes() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/chats' element={<ChatPage/>}/>

            <Route path='/login' element={<UserLogin/>}/>
            <Route path='/signup' element={<SignupPage/>}/>
        </Routes>

    </div>
  )
}

export default UserRoutes