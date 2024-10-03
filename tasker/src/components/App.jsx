import React, { useEffect, useState } from "react";
import { NavBar } from "./NavBar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Landing from "./Landing";
import Login from "./Login";
import About from "./About";
import SignUp from "./SignUp";
import Home from "./Home";
import Verification from "./Verification";

const App = () => {
  // useEffect(() => {
  //   const clearLocalStorage = () => {
  //     localStorage.clear();
  //   };

  //   // Clear local storage on window unload (close or refresh)
  //   window.addEventListener("unload", clearLocalStorage);

  //   return () => {
  //     // Clean up the event listener when the component is unmounted
  //     window.removeEventListener("unload", clearLocalStorage);
  //   };
  // }, []);
  const [isV, setV] = useState(false);
  const navigate = useNavigate(); // Hook to programmatically navigate

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
        setV(data.user.isVerified); // Update verification status
      }
    };
    getUser();
  }, []);

  return (
    <div>
      <NavBar />
      <Routes>
        {/* If user is not logged in, take them to the landing page */}
        <Route
          path="/"
          element={localStorage.getItem("authtoken") ? <Home /> : <Landing />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/verify" element={<Verification />} />
      </Routes>
    </div>
  );
};

// Wrap App in Router to use useNavigate
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
