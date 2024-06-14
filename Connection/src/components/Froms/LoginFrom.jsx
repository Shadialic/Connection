import React, { useState } from "react";
import login from "../../../public/signup.jpg";
import bg from "../../../public/bglogin.webp";
import user from "../../../public/user.svg";
import { useNavigate } from "react-router-dom";
import { LoginData } from "../../api/UserApi";
import toast, { Toaster } from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // const GoogleLogin = useGoogleLogin({
  //   onSuccess: (codeResponse) => setUser(codeResponse),
  //   onError: () => toast.error("Goole login failed"),
  // });
  const navigate = useNavigate();

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
        navigate("/");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="w-screen h-screen bg-[#caf0f8] flex justify-center items-center relative">
      <img
        src={bg}
        alt=""
        className="absolute w-full h-full object-cover z-0"
      />
      <div className="w-[85%] h-[88%] bg-[#fff] rounded-3xl flex justify-center items-center shadow-lg relative z-10 p-8">
        <div className="flex w-full h-[90%] shadow-xl">
          <div className="flex justify-center items-center w-1/2 h-full">
            <img
              src={login}
              alt=""
              className="w-[90%] h-[90%] object-contain"
            />
          </div>
          <div className="flex flex-col justify-center gap-2 items-center w-1/2 h-full">
            <img src={user} alt="" className="w-32" />
            <h1>Sign in to your Account</h1>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col p-2 justify-center items-center gap-4 w-full"
            >
              <input
                type="text"
                id="email"
                className="outline-none border-2 h-10 w-[70%] border-[#d8ddde] rounded-full text-[14px] pl-3"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="password"
                id="password"
                className="outline-none border-2 h-10 w-[70%] border-[#d8ddde] rounded-full text-[14px] pl-3"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <a className="text-[14px] text-[#0077b6] pr-2">
                Forgot Password?
              </a>
              <div className="flex justify-center w-full gap-10">
                <button
                  type="submit"
                  className="h-9 w-[18%] p-1 bg-[#8338ec] rounded-full text-white "
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="h-9 w-[18%] text-[#8338ec] border-2 border-[#8338ec] rounded-full"
                >
                  Sign Up
                </button>
              </div>
            </form>
            <h1 className="text-sm text-[#d8ddde]">OR LOGIN WITH</h1>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default LoginForm;
