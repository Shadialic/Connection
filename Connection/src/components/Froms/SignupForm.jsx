import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { UserData, userSigninGoogle } from "../../api/UserApi";
import { FcGoogle } from "react-icons/fc";
import sganime from "../../assets/video/Sloop.mp4";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

function SignupForm() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState([]);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  const GoogleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: () => toast.error("Google login failed"),
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const response = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
            {
              headers: {
                Authorization: `Bearer ${user.access_token}`,
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
  }, [user]);
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
    try {
      const userData = await UserData(
        {
          userName: trimmedUserName,
          email: trimmedEmail,
          password: trimmedPassword,
        },
        image
      );
      toast(userData.message);
      navigate("/otp", { state: userData.userData });
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="w-full h-screen flex flex-row items-start justify-start">
      <h1 className="absolute font-extrabold p-6 text-4xl text-white">
        Connections
      </h1>
      <video
        src={sganime}
        loop
        autoPlay
        muted
        className="h-full w-[35%] object-cover"
      ></video>
      <div className="w-full mt-[1rem]">
        <div className="flex flex-col gap-1">
          <h1 className="text-black text-2xl font-bold ml-[10rem]">
            Sign up to Connections
          </h1>
          <div
            onClick={GoogleLogin}
            className="flex flex-row items-center gap-2 ml-[10rem] border-2 border-gray-200 w-[22rem] justify-center p-3 rounded-full cursor-pointer"
          >
            <FcGoogle className="w-5 h-5" />
            <button className="font-semibold">Sign up with Google</button>
          </div>
          <span className="flex flex-row items-center ml-[10rem]">
            <div className="w-24 border-b-2 border-gray-200"></div>
            <span className="px-4 text-gray-500">or sign up with email</span>
            <div className="w-24 border-b-2 border-gray-200"></div>
          </span>
          <div className="flex flex-col ml-[10rem] gap-2">
            <label htmlFor="username" className="font-semibold">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="border-2 border-gray-200 w-[22rem] justify-center p-3 rounded-xl"
            />
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-gray-200 w-[22rem] justify-center p-3 rounded-xl"
            />
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 border-gray-200 w-[22rem] justify-center p-3 rounded-xl"
            />
            <div className="border-2 border-gray-200 w-[22rem] outline-none justify-center p-3 mt-1 rounded-xl text-center">
              <label htmlFor="image" className="cursor-pointer">
                {image ? <>{image.name}</> : "Upload Image"}
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                style={{ display: "none" }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 ml-[10rem] bg-[#76949f] border-2 hover:border-gray-500 w-[22rem] justify-center p-2 rounded-full">
            <button
              onClick={handleSubmit}
              className="w-[22rem] justify-center p-3 rounded-xl text-white font-bold"
            >
              Sign up
            </button>
          </div>
          <span className="ml-[14rem]">
            Already have an account?{" "}
            <button className="underline" onClick={() => navigate("/login")}>
              Sign In
            </button>
          </span>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default SignupForm;
