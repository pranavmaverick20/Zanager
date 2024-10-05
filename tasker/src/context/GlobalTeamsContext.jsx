import { createContext, useState, useEffect } from "react";

export const GlobalTeamsContext = createContext();

export const GlobalTeamsState = (props) => {
  const [teams, setTeams] = useState([]);
  const getTeams = async () => {
    const response = await (
      await fetch("http://localhost:5001/api/team/userteams", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
      })
    ).json();
    setTeams(response.teams);
  };
  return (
    <GlobalTeamsContext.Provider value={{ teams, setTeams, getTeams }}>
      {props.children}
    </GlobalTeamsContext.Provider>
  );
};
