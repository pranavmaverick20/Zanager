import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const TeamCard = (props) => {
  const { name, description, _id, code } = props.team;

  return (
    <div className="flex flex-col justify-between items-center rounded-lg bg-[#CAF0F8] text-black h-56 w-64 p-6 shadow-md transition-transform transform hover:scale-105 hover:shadow-xl">
      <div className="flex flex-row justify-between items-center w-full">
        <h3 className="font-sans font-bold text-xl text-left text-gray-800">
          {name}
        </h3>
        <FontAwesomeIcon
          className="hover:cursor-pointer text-gray-700 hover:text-red-500 transition-colors duration-200"
          icon={faRightFromBracket}
          onClick={(e) => props.onOpenL(e, _id)}
        />
      </div>

      <div className="flex flex-col justify-start items-start h-max w-full mt-3">
        <p className="text-gray-600 text-sm leading-5 mb-2">
          <span className="text-wrap text-clip whitespace-nowrap">
            {description}
          </span>
        </p>
        <p className="text-gray-500 text-sm">Code: {code}</p>
      </div>
    </div>
  );
};

export default TeamCard;
