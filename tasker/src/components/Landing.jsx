import React from "react";
import { Link, useNavigate } from "react-router-dom";
const Landing = () => {
  const navigate = useNavigate;

  return (
    <div>
      <div className="flex items-center flex-col justify-center h-screen bg-gradient-to-tl from-[#98edb0] bg-[#023E8A]">
        <div className="flex flex-row py-7">
          <h1 className="font-sans text-5xl font-extrabold text-[#E1ECF7]">
            Welcome to
          </h1>
          <h1 className="font-zanager text-5xl font-extrabold ml-3 text-[#E1ECF7]">
            Zanager!
          </h1>
        </div>
        <p className="font-sans text-lg font-medium text-[#E1ECF7]">
          Your Zen Task Manager.
        </p>
        <p className="font-sans text-lg font-medium text-[#E1ECF7]">
          Focus on what matters most and let Zanager handle the rest for a
          Zen-like experience.
        </p>
        <p className="font-sans text-lg font-medium text-[#E1ECF7]">
          Join our community and start managing your tasks efficiently!
        </p>
        <div className="flex flex-row gap-4 py-6">
          <Link to="/signup">
            <button className="text-white font-small bg-[#71A5DE] py-2 px-3 rounded-xl bg-opacity-95 hover:opacity-100 hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-200 ease-in-out">
              Get Started
            </button>
          </Link>
          <Link to="/login">
            <button className="text-white font-small bg-[#023E8A] py-2 px-3 rounded-xl bg-opacity-95 hover:bg-[#AECBEB] hover:text-black transition-all duration-200 ease-in-out">
              Already have an account?
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
