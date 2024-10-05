import React, { useContext, useEffect, useState } from "react";
import { CredCheckContext } from "../context/CredCheckContext";
import { useNavigate } from "react-router-dom";
import { GlobalTeamsContext } from "../context/GlobalTeamsContext";

const CreateTeam = () => {
  const { checkLogin, checkVerify } = useContext(CredCheckContext);
  const { teams, setTeams } = useContext(GlobalTeamsContext);
  useEffect(() => {
    checkLogin();
    checkVerify();
  }, []);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [data, setData] = useState({ name: "", description: "" });
  const onSubmit = async (e) => {
    e.preventDefault();
    const response = await (
      await fetch("http://localhost:5001/api/team/createteam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
        }),
      })
    ).json();
    if (response.success) {
      setTeams((teams) => [...teams, response.team]);
      navigate("/myteams");
    } else {
      setData({ name: "", description: "" });
      setMessage("Some error occurred");
    }
  };
  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-tl from-[#98edb0] bg-[#023E8A]">
      <div className="bg-gray-200 shadow-2xl min-w-[25%] min-h-[30%] rounded-3xl mb-20">
        <form
          onSubmit={onSubmit}
          className="px-7 py-8 flex flex-col justify bg-center space-y-4"
        >
          <p className="text-3xl font-bold text-gray-800">Create team</p>

          <div className="w-full">
            <label className="py-4 text-md mx-1 font-medium text-gray-700">
              Name
            </label>
            <input
              name="name"
              minLength={5}
              value={data.name}
              onChange={onChange}
              className="block mt-2 border-black border-3 w-full rounded-xl p-2 h-12"
            ></input>
          </div>
          <div className="w-full">
            <label className="py-4 mx-1 text-md font-medium text-gray-700">
              Description
            </label>
            <input
              name="description"
              value={data.description}
              onChange={onChange}
              className="block mt-2 border-black border-3 w-full rounded-xl p-2 h-12"
              minLength={8}
            ></input>
          </div>
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

export default CreateTeam;
