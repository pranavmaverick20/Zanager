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
import Teams from "./Teams";
import { CredCheckState } from "../context/CredCheckContext";
import JoinTeam from "./JoinTeam";
import CreateTeam from "./CreateTeam";
import { GlobalTeamsState } from "../context/GlobalTeamsContext";
import AddTask from "./AddTask";
import PNF from "./PNF";
import Task from "./Task";

const App = () => {
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
      <CredCheckState>
        <GlobalTeamsState>
          <NavBar />
          <Routes>
            {/* If user is not logged in, take them to the landing page */}
            <Route
              path="/"
              element={
                localStorage.getItem("authtoken") ? <Home /> : <Landing />
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/verify" element={<Verification />} />
            <Route path="/myteams" element={<Teams />} />
            <Route path="/jointeam" element={<JoinTeam />} />
            <Route path="/createteam" element={<CreateTeam />} />
            <Route path="/addtask" element={<AddTask />} />
            <Route path="/task/:at/:id" element={<Task />} />
            <Route path="*" element={<PNF />} />
          </Routes>
        </GlobalTeamsState>
      </CredCheckState>
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
