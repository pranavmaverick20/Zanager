import React from "react";
import { Link } from "react-router-dom";
export const NavBar = () => {
  return (
    <div>
      <div className="flex flex-row justify-between items-center py-4 px-8 bg-[#023E8A] ">
        <div>
          <h1 className="text-4xl text-[#98edb0] font-zanager hover:cursor-pointer">
            <Link to="/">Zanager</Link>
          </h1>
        </div>
        <div>
          <ul className="flex flex-row basis-8 space-x-10 text-center">
            <li className="navbar-item hover:cursor-pointer">
              <Link to="/login">Login</Link>
            </li>
            <li className="navbar-item hover:cursor-pointer">
              <Link to="/signup">Signup</Link>
            </li>
            <li className="navbar-item hover:cursor-pointer">
              <Link about="/about">About</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
