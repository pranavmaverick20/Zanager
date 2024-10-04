import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import LeaveModal from "./LeaveModal";

const TeamCard = (props) => {
  const { name, description, _id, code } = props.team;

  const maxDescriptionLength = 20;
  const truncatedDescription =
    description && description.length > maxDescriptionLength
      ? `${description.slice(0, maxDescriptionLength)}...`
      : description;

  return (
    <div className="flex flex-col justify-around items-center rounded-lg bg-[#CAF0F8] text-[#0077B6] h-40 w-40 p-4 shadow-md">
      <div className="flex flex-row justify-between items-center space-x-10">
        <p className="font-sans font-bold text-xl text-center">{name}</p>
        <FontAwesomeIcon
          className="hover:cursor-pointer"
          icon={faRightFromBracket}
          onClick={(e) => props.onOpenL(e, _id)}
        />
      </div>

      <div>
        <p className="overflow-hidden whitespace-nowrap text-ellipsis max-w-full">
          {truncatedDescription}
        </p>
        <p>code: {code}</p>
      </div>
    </div>
  );
};

export default TeamCard;
