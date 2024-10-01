import React from "react";
import { NavBar } from "./NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Login from "./Login";
import About from "./About";
import SignUp from "./SignUp";
const App = () => {
  return (
    <div>
      <Router>
        <NavBar />
        <Routes>
          {/* if user  is not logged in take him to landing otherwise route / to Home */}
          {/* Make home component */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
