import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
export const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = (e) => {
    localStorage.removeItem("authtoken");
    navigate("/");
  };
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
            {!localStorage.getItem("authtoken") ? (
              <li
                className={`navbar-item hover:cursor-pointer ${
                  location.pathname == "/login"
                    ? "border-[#71A5DE] border-4"
                    : "border-[#98edb0] border-4"
                }`}
              >
                <Link to="/login">Login</Link>
              </li>
            ) : (
              <li
                onClick={handleLogout}
                className={`navbar-item hover:cursor-pointer ${
                  location.pathname == "/login"
                    ? "border-[#71A5DE] border-4"
                    : "border-[#98edb0] border-4"
                }`}
              >
                <Link to="/login">Log out</Link>
              </li>
            )}
            <li
              className={`navbar-item hover:cursor-pointer ${
                location.pathname === "/about" && "border-[#71A5DE] border-4"
              }`}
            >
              <Link to="/about">About</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
