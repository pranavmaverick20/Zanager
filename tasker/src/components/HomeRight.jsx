import React from "react";
import { useNavigate } from "react-router-dom";

const HomeRight = () => {
  const navigate = useNavigate();
  const clickTeams = () => {
    navigate("/myteams");
  };
  return (
    <div className="flex justify-center flex-col mx-48 items-center content-center">
      <button
        onClick={() => navigate("/addtask")}
        className="w-72 bg-[#023E8A] my-5  font-medium text-white py-3 rounded-xl justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-200 ease-in-out"
      >
        Add new Task
      </button>
      <button
        onClick={clickTeams}
        className="w-72 bg-[#023E8A] font-medium text-white py-3 rounded-xl justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-200 ease-in-out"
      >
        View Teams
      </button>
    </div>
  );
};

export default HomeRight;
