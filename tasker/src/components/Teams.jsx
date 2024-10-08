import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CredCheckContext } from "../context/CredCheckContext";
import TeamCard from "./TeamCard";
import LeaveModal from "./LeaveModal";
import TeamsRight from "./TeamsRight";
import { GlobalTeamsContext } from "../context/GlobalTeamsContext";

const Teams = () => {
  const { teams, setTeams, getTeams } = useContext(GlobalTeamsContext);
  const navigate = useNavigate();
  const { checkLogin, checkVerify } = useContext(CredCheckContext);
  const [modalL, setModalL] = useState(false);
  const [id, setId] = useState(0);
  const onOpenL = (e, eid) => {
    setId(eid);
    setModalL(true);
  };
  const onCloseL = (e) => {
    setModalL(false);
  };
  useEffect(() => {
    checkLogin();
    checkVerify();
    getTeams();
    //   const getTeams = async () => {
    //     const response = await (
    //       await fetch("http://localhost:5001/api/team/userteams", {
    //         method: "GET",
    //         headers: {
    //           "Content-Type": "application/json",
    //           authtoken: localStorage.getItem("authtoken"),
    //         },
    //       })
    //     ).json();
    //     setTeams(response.teams);
    //   };
    //   getTeams();
    // }
  }, []);
  return (
    <div className="flex justify-center h-screen w-screen bg-gradient-to-tl from-[#98edb0] to-[#023E8A]">
      <div className="flex-1 flex-col justify-center">
        <p className="text-5xl mt-12 font-bold my-10 text-[#98edb0] mx-10">
          My teams
        </p>
        <LeaveModal
          isOpen={modalL}
          onClose={onCloseL}
          id={id}
          setTeams={setTeams}
          teams={teams}
        />
        <div className="m-10 flex flex-row gap-10 flex-wrap">
          {teams.map((team) => (
            <TeamCard
              key={team._id}
              team={team}
              onCloseL={onCloseL}
              onOpenL={onOpenL}
            />
          ))}
        </div>
      </div>
      <div className="flex-1 flex justify-center items-start py-56">
        <TeamsRight setTeams={setTeams} teams={teams} />
      </div>
    </div>
  );
};

export default Teams;
