import React, { useState } from "react";
import login from "../../../public/loginpage.jpg";
import bg from "../../../public/bglogin.webp";
import user from "../../../public/user.svg";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { UserData } from "../../api/UserApi";

function SignupForm() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedUserName = userName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!trimmedUserName || !trimmedEmail || !trimmedPassword || !image) {
      toast.error("All fields are required");
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      toast.error("Invalid email address");
      return;
    }
    if (trimmedPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    const userData = await UserData(
      {
        userName: userName,
        email: email,
        password: password,
      },
      image
    );
    toast(userData.message);
     navigate("/otp");
  };

  return (
    <div className="w-screen h-screen bg-[#caf0f8] flex justify-center items-center relative">
      <img
        src={bg}
        alt=""
        className="absolute w-full h-full object-cover z-0"
      />
      <div className="w-[85%] h-[88%] bg-[#fff] rounded-3xl flex justify-center items-center shadow-lg relative z-10 p-8">
        <div className="flex flex-col justify-center gap-2 items-center w-1/2 h-full">
          <img src={user} alt="" className="w-32" />
          <h1>Create your new Account</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col p-2 justify-center items-center gap-4 w-full"
          >
            <input
              type="text"
              id="name"
              className="outline-none border-2 h-10 w-[70%] border-[#d8ddde] rounded-full text-[14px] pl-3"
              placeholder="UserName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="text"
              id="email"
              className="outline-none border-2 h-10 w-[70%] border-[#d8ddde] rounded-full text-[14px] pl-3"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              id="password"
              className="outline-none border-2 h-10 w-[70%] border-[#d8ddde] rounded-full text-[14px] pl-3"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="file"
              id="image"
              className="outline-none border-2 h-10 w-[70%] border-[#d8ddde] rounded-full text-[14px] pl-3 py-1"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <div className="flex justify-center w-full gap-10">
              <button
                type="submit"
                className="h-9 w-[18%] rounded-full  bg-[#8338ec] text-white "
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="h-9 w-[18%] p-1 text-[#8338ec] border-2 border-[#8338ec]  rounded-full "
              >
                Sign In
              </button>
            </div>
          </form>
          <h1 className="text-sm text-[#d8ddde]">OR LOGIN WITH</h1>
        </div>
        <div className="flex justify-center items-center w-1/2 h-full">
          <img src={login} alt="" className="w-[70%] h-[90%] object-contain" />
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default SignupForm;
