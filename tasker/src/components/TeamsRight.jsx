import React from "react";

const TeamsRight = ({ setTeams, teams }) => {
  return (
    <div className="flex items-center flex-col justify-center">
      <button className="w-72 bg-[#023E8A] my-5  font-medium text-white py-3 rounded-xl justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-200 ease-in-out">
        Join team with code
      </button>
      <button className="w-72 bg-[#023E8A] font-medium text-white py-3 rounded-xl justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-200 ease-in-out">
        Create Team
      </button>
    </div>
  );
};

export default TeamsRight;
