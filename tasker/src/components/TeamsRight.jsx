import React from "react";
import { useNavigate } from "react-router-dom";

const TeamsRight = () => {
  //make this global context teams and setTeams
  const navigate = useNavigate();
  return (
    <div className="flex items-center flex-col justify-center">
      <button
        onClick={() => navigate("/jointeam")}
        className="w-72 bg-[#023E8A] my-5  font-medium text-white py-3 rounded-xl justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-200 ease-in-out"
      >
        Join team with code
      </button>
      <button
        onClick={() => navigate("/createteam")}
        className="w-72 bg-[#023E8A] font-medium text-white py-3 rounded-xl justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-200 ease-in-out"
      >
        Create Team
      </button>
    </div>
  );
};

export default TeamsRight;
