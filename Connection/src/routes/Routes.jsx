import React from 'react'
import { Route, Routes } from "react-router-dom";
import Home from '../pages/UserPages/Home/Home';
import UserLogin from '../pages/UserPages/Login/UserLogin';
import SignupPage from '../pages/UserPages/Signup/SignupPage';


function UserRoutes() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<UserLogin/>}/>
            <Route path='/signup' element={<SignupPage/>}/>

        </Routes>

    </div>
  )
}

export default UserRoutes