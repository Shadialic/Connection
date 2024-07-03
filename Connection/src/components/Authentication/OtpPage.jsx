import React, { useRef, useState } from "react";
import { otpVerification } from "../../api/UserApi";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const otpCss = {
  width: "40px",
  height: "40px",
  margin: "5px",
  textAlign: "center",
  fontSize: "1.2em",
};

const Otp = ({ length = 6 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state;
  const inputRef = useRef([]);
  const [value, setValue] = useState(new Array(length).fill(""));

  const onChangeHandler = (e, index) => {
    const { value: inputValue } = e.target;
    if (isNaN(inputValue)) return;

    const newValue = [...value];
    newValue[index] = inputValue.slice(-1);
    setValue(newValue);

    if (inputValue && index < length - 1) {
      inputRef.current[index + 1].focus();
    }

    const finalValue = newValue.join("");
  };

  const onKeyDownHandler = (e, index) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalValue = value.join("");
    const response = await otpVerification({ finalValue, userData });
    toast(response.message);
    if (response.success) {
      navigate("/login");
    }
  };

  return (
    <div className="bg-authentication-background bg-cover bg-gray-100 flex justify-center items-center w-screen h-screen py-7 px-5">
      <div className="bg-white w-full sm:max-w-[80%] min-h-[100%] overflow-auto rounded-md flex justify-center items-center shadow-xl p-3 gap-5 flex-row">
        <div className="justify-center items-center text-center hidden lg:flex flex-col lg:w-1/2 relative">
          <div className="font-semibold text-lg w-full">
            <span className="font-prompt-semibold text-4xl mt-20">
              Connection
            </span>
          </div>
        </div>

        <div className="sm:w-1/2 w-full h-full flex flex-col justify-center items-center">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center w-full gap-4">
              <div className="flex flex-col justify-center gap-3 px-5 py-2">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col items-center gap-3">
                    <label
                      htmlFor="otpFields"
                      className="text-[14px] text-shadow-black"
                    >
                      Verification code
                      <span className="text-red-600 ml-1"></span>
                    </label>
                    <div className="relative flex flex-col justify-center">
                      <div className="flex items-center">
                        {value.map((digit, index) => (
                          <input
                            key={index}
                            value={digit}
                            maxLength={1}
                            onChange={(e) => onChangeHandler(e, index)}
                            onKeyDown={(e) => onKeyDownHandler(e, index)}
                            ref={(reference) =>
                              (inputRef.current[index] = reference)
                            }
                            className="border w-10 h-10 text-center p-3 rounded-md block bg-white focus:border-2 focus:outline-none appearance-none mx-1"
                            style={otpCss}
                          />
                        ))}
                      </div>
                      <div className="flex justify-center items-center bottom-0">
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <button
                    className="bg-violet-600 rounded-md text-white btn-class w-full flex justify-center items-center gap-2"
                    type="submit"
                  >
                    Confirm
                  </button>
                </div>
                <div className="flex w-full h-fit justify-start items-center text-[13px] text-primary">
                  <span className="cursor-pointer w-fit h-fit flex">
                    <svg
                      onClick={() => navigate("/signup")}
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 16 16"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ fontSize: "20px" }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"
                      ></path>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Otp;
