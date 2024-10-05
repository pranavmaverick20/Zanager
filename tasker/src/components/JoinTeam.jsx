import React, { useEffect, useContext, useState } from "react";
import { CredCheckContext } from "../context/CredCheckContext";
import { useNavigate } from "react-router-dom";

const JoinTeam = () => {
  const { checkLogin, checkVerify } = useContext(CredCheckContext);
  useEffect(() => {
    checkLogin();
    checkVerify();
  }, []);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const onSubmit = async (e) => {
    e.preventDefault();
    const response = await (
      await fetch("http://localhost:5001/api/team/jointeam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
        body: JSON.stringify({
          code: code,
        }),
      })
    ).json();
    if (response.success) {
      navigate("/myteams");
    } else {
      setCode("");
      if (response.code == "uait") {
        setMessage("*User already in team");
      } else {
        setMessage("*Incorrect code");
      }
    }
  };
  const onChange = (e) => {
    setCode(e.target.value);
  };
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-tl from-[#98edb0] bg-[#023E8A]">
      <div className="bg-gray-200 shadow-2xl min-w-[25%] min-h-[30%] rounded-3xl mb-20">
        <form
          onSubmit={onSubmit}
          className="px-7 py-8 flex flex-col justify bg-center space-y-4"
        >
          <p className="text-3xl font-bold mb-3 text-gray-800">
            Enter code to join
          </p>

          <input
            minLength={5}
            value={code}
            onChange={onChange}
            className="block mt-7 border-black border-3 w-full rounded-xl p-2  h-12"
          ></input>

          <p className="text-red-600 h-8 font-normal">{message}</p>
          <div className="flex flex-row space-x-5">
            <button
              onClick={() => {
                navigate("/myteams");
              }}
              className="basis-1/2 flex bg-[#023E8A] font-medium text-white py-3 rounded-xl justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-200 ease-in-out"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="basis-1/2 flex bg-[#023E8A] font-medium text-white py-3 rounded-xl justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-200 ease-in-out"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinTeam;
