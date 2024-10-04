import React from "react";

const LeaveModal = ({ isOpen, onClose, id, teams, setTeams }) => {
  if (!isOpen) return null;
  const onDelete = async () => {
    await fetch("http://localhost:5001/api/team/leaveteam", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authtoken: localStorage.getItem("authtoken"),
      },
      body: JSON.stringify({ id: id }),
    });
    teams = teams.filter((team) => team._id != id);
    setTeams(teams);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-200  p-6 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4">Leave Team</h2>
        <p>Are you sure you want to leave this team?</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white p-2 rounded-xl mr-2 hover:bg-blue-800 transition-all duration-100"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-800 transition-all duration-100"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveModal;
