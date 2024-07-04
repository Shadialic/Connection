import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginData, userSigninGoogle } from "../../api/UserApi";
import toast, { Toaster } from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import lganime from "../../assets/video/login.mp4";
import axios from "axios";

function LoginForm() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const GoogleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => setUsers(codeResponse),
    onError: () => toast.error("Google login failed"),
  });
  console.log(users, "AAAAAAAAAA");
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (users) {
          const response = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${users.access_token}`,
            {
              headers: {
                Authorization: `Bearer ${users.access_token}`,
                Accept: "application/json",
              },
            }
          );
          const result = await userSigninGoogle(response.data);
          if (result.data.created) {
            toast(result.data.message);
            localStorage.setItem("token", result.data.token);
            navigate("/chats");
          } else {
            toast.error(result.data.message);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [users]);
  console.log();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();
    if (!trimmedEmail || !trimmedPassword) {
      toast.error("All fields are required");
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      toast.error("Invalid email address");
      return;
    }
    try {
      const userData = await LoginData({
        formData,
      });
      toast(userData.alert);
      localStorage.setItem("token", userData.token);
      if (userData.status && userData.token) {
        navigate("/chats");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="w-full h-screen flex flex-row items-start justify-start">
      <h1 className="absolute font-extrabold p-6 text-4xl text-white">
        Connections
      </h1>
      <video
        src={lganime}
        loop
        autoPlay
        muted
        className="w-[35%] h-full object-cover hidden md:block"
      ></video>
      <div className="w-full mt-[4rem]">
        <div className="flex flex-col gap-6">
          <h1 className="text-black text-2xl font-bold ml-[10rem]">
            Sign in to Connections
          </h1>
          <div
            className="flex flex-row items-center gap-2 ml-[10rem] border-2 border-gray-200 w-[22rem] justify-center p-3 rounded-full cursor-pointer"
            onClick={GoogleLogin}
          >
            <FcGoogle className="w-5 h-5" />
            <button className="font-semibold text-lg">
              Sign in with Google
            </button>
          </div>
          <span className="flex flex-row items-center ml-[10rem]">
            <div className="w-24 border-b-2 border-gray-200"></div>
            <span className="px-4 text-gray-500">or sign in with email</span>
            <div className="w-24 border-b-2 border-gray-200"></div>
          </span>
          <div className="flex flex-col ml-[10rem] gap-2 ">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              id="email"
              value={formData.email}
              onChange={handleChange}
              type="text"
              className="border-2 border-gray-200 w-[22rem] justify-center p-3 rounded-xl"
            />
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              id="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              className="border-2 border-gray-200 w-[22rem] justify-center p-3 rounded-xl"
            />
          </div>
          <div className="flex items-center gap-2 ml-[10rem] bg-[#82c0cc] border-2 hover:border-gray-500 w-[22rem] justify-center p-2 rounded-full">
            <button
              className="w-[22rem] justify-center p-3 rounded-xl text-white font-bold"
              onClick={handleSubmit}
            >
              Sign In
            </button>
          </div>
          <span className="ml-[14rem]">
            Don't have an account?{" "}
            <button className="underline" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </span>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default LoginForm;
