import { createContext, useState } from "react";

export const GlobalTeamsContext = createContext();

export const GlobalTeamsState = (props) => {
  const [teams, setTeams] = useState([]);
  return (
    <GlobalTeamsContext.Provider value={{ teams, setTeams }}>
      {props.children}
    </GlobalTeamsContext.Provider>
  );
};
