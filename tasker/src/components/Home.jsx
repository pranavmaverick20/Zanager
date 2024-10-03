import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("authtoken");
      if (token) {
        const response = await fetch("http://localhost:5001/api/auth/getuser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authtoken: token,
          },
        });
        const data = await response.json();
        if (!data.user.isVerified) {
          navigate("/verify");
        }
      }
    };
    getUser();
  }, []);
  return <div>Home</div>;
};

export default Home;
