import React, { useState, useEffect, useMemo } from "react";
import PNF from "./PNF";
import { useNavigate } from "react-router-dom";

const Verification = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState(true);
  const [otp, setotp] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authtoken");
      if (!token) {
        navigate("/");
        return;
      }
      const response = await fetch("http://localhost:5001/api/auth/getuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authtoken: token,
        },
      });
      const data = await response.json();
      setUser(data.user); // Set loading to false after fetching
    };

    fetchUser();
  }, []);

  if (!localStorage.getItem("authtoken")) {
    return <PNF />;
  }

  const sendOTP = async (e) => {
    e.preventDefault();
    setSent(true);
    const response = await (
      await fetch("http://localhost:5001/api/auth/sendotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
      })
    ).json();
  };

  // const BeforeSend = () => {
  //   return (
  //     <div className="px-7 py-8 flex flex-col justify bg-center space-y-4">
  //       <p className="text-4xl font-bold text-gray-800">Verify email</p>
  //       <p>Send OTP to {user?.email}</p>
  //       <div className="w-full">
  //         <label className="py-4 text-md font-medium text-gray-700">
  //           Click to send
  //         </label>
  //       </div>
  //       <button
  //         onClick={sendOTP}
  //         className="basis-1/2 flex bg-[#023E8A] font-medium text-white py-3 rounded-xl justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-200 ease-in-out"
  //       >
  //         Send OTP
  //       </button>
  //     </div>
  //   );
  // };

  const submitOTP = async (e) => {
    e.preventDefault();
    const response = await (
      await fetch("http://localhost:5001/api/auth/verifyotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
        body: JSON.stringify({ otp: otp }),
      })
    ).json();
    if (response.success) {
      setMessage("Logged in... redirecting");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } else {
      if (response.code === "io") {
        setMessage("*Incorrect OTP");
      } else {
        setMessage("*OTP expired reload");
      }
    }
  };

  const onChange = (e) => {
    e.preventDefault();
    setotp(e.target.value);
  };

  // const AfterSend = () => {
  //   return (
  //     <form
  //       onSubmit={submitOTP}
  //       className="px-7 py-8 flex flex-col justify bg-center space-y-4"
  //     >
  //       <p className="text-4xl font-bold text-gray-800">Verify email</p>
  //       <p>OTP has been sent to {user?.email}</p>
  //       <div className="w-full">
  //         <label className="py-4 text-md font-medium text-gray-700">
  //           Enter OTP Here
  //         </label>
  //         <input
  //           onChange={onChange}
  //           name="OTP"
  //           value={otp}
  //           className="block border-black border-3 w-full rounded-xl p-2 h-12"
  //         ></input>
  //       </div>
  //       <p
  //         className={`${
  //           message === "Logged in... redirecting"
  //             ? `text-black`
  //             : `text-red-600`
  //         } font-normal`}
  //       >
  //         {message}
  //       </p>

  //       <button
  //         type="submit"
  //         className="basis-1/2 flex bg-[#023E8A] font-medium text-white py-3 rounded-xl justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-200 ease-in-out"
  //       >
  //         Submit OTP
  //       </button>
  //     </form>
  //   );
  // };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-tl from-[#98edb0] bg-[#023E8A]">
      <div className="bg-gray-200 shadow-2xl min-w-[25%] min-h-[20%] rounded-3xl mb-20">
        {!sent ? (
          <div className="px-7 py-8 flex flex-col justify bg-center space-y-4">
            <p className="text-4xl font-bold text-gray-800">Verify email</p>
            <p>Send OTP to {user?.email}</p>
            <div className="w-full">
              <label className="py-4 text-md font-medium text-gray-700">
                Click to send
              </label>
            </div>
            <button
              onClick={sendOTP}
              className="basis-1/2 flex bg-[#023E8A] font-medium text-white py-3 rounded-xl justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-200 ease-in-out"
            >
              Send OTP
            </button>
          </div>
        ) : (
          <form
            onSubmit={submitOTP}
            className="px-7 py-8 flex flex-col justify bg-center space-y-4"
          >
            <p className="text-4xl font-bold text-gray-800">Verify email</p>
            <p>OTP has been sent to {user?.email}</p>
            <div className="w-full">
              <label className="py-4 text-md font-medium text-gray-700">
                Enter OTP Here
              </label>
              <input
                onChange={onChange}
                name="OTP"
                value={otp}
                className="block border-black border-3 w-full rounded-xl p-2 mt-2 h-12"
              ></input>
            </div>
            <p
              className={`${
                message === "Logged in... redirecting"
                  ? `text-black`
                  : `text-red-600`
              } font-normal`}
            >
              {message}
            </p>

            <button
              type="submit"
              className="basis-1/2 flex bg-[#023E8A] font-medium text-white py-3 rounded-xl justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-200 ease-in-out"
            >
              Submit OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Verification;
