import React from "react";
import { NavBar } from "./NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
const App = () => {
  return (
    <div className="bg-[#90E0EF]">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
