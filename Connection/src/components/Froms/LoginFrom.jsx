import React from "react";
import login from "../../../public/signup.jpg";
import bg from "../../../public/bglogin.webp";
import user from "../../../public/user.svg";
import { useNavigate } from 'react-router-dom';
function LoginForm() {
  const navigate=useNavigate()
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
              action=""
              className="flex flex-col p-2 justify-center items-center gap-4 w-full"
            >
              <input
                type="text"
                id="email"
                className="outline-none border-2 h-10 w-[70%] border-[#d8ddde] rounded-full text-[14px] pl-3"
                placeholder="Email"
              />
              <input
                type="password"
                id="password"
                className="outline-none border-2 h-10 w-[70%] border-[#d8ddde] rounded-full text-[14px] pl-3"
                placeholder="Password"
              />
              <a className="s text-[14px] text-[#0077b6] pr-2">
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
                 onClick={()=>navigate('/signup')}
                  className="h-9 w-[18%] text-[#8338ec] border-2 border-[#8338ec] rounded-full"
                >
                  Sign Up{" "}
                </button>
              </div>
            </form>
            <h1 className="text-sm text-[#d8ddde]">OR LOGIN WITH</h1>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}

export default LoginForm;
