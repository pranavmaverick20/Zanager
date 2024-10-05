import React, { useContext, useEffect, useState } from "react";
import { CredCheckContext } from "../context/CredCheckContext";
import { GlobalTeamsContext } from "../context/GlobalTeamsContext";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
  const { checkLogin, checkVerify } = useContext(CredCheckContext);
  const { teams, getTeams } = useContext(GlobalTeamsContext);

  useEffect(() => {
    checkLogin();
    checkVerify();
    getTeams();
  }, []);

  const [team, setTeam] = useState("");
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState("");
  const [task, setTask] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [message, setMessage] = useState("");
  const [assignee, setAssignee] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const getUser = async () => {
      const res = await (
        await fetch("http://localhost:5001/api/auth/getuser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authtoken: localStorage.getItem("authtoken"),
          },
        })
      ).json();
      setAssignee(res.user._id);
    };
    getUser();
  }, []);

  const selectTeam = async (e) => {
    const selectedTeam = e.target.value;
    setTeam(selectedTeam);
    const response = await fetch(
      `http://localhost:5001/api/team/getusers/${selectedTeam}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    setUsers(data.users || []);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const response = await (
      await fetch(`http://localhost:5001/api/tasks/createtask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          deadline: task.deadline,
          assigneeemail: user,
          reportedId: assignee,
        }),
      })
    ).json();
    if (response.success) {
      navigate("/");
    } else {
      setMessage("*Some error occurred");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-tl from-[#98edb0] bg-[#023E8A]">
      <div className="bg-gray-200 shadow-2xl min-w-[50%] min-h-[75%] rounded-3xl mb-20">
        <form
          onSubmit={onSubmit}
          className="px-7 py-8 flex flex-col justify bg-center space-y-4"
        >
          <p className="text-3xl font-bold text-gray-800">Assign new task</p>

          <div className="w-full">
            <label className="py-4 text-md mx-1 font-medium text-gray-700">
              Title
            </label>
            <input
              onChange={(e) => {
                setTask({ ...task, title: e.target.value });
              }}
              className="block mt-2 border-black border-3 w-full rounded-xl p-2 h-12"
            />
          </div>

          <div className="w-full">
            <label className="py-4 mx-1 text-md font-medium text-gray-700">
              Description
            </label>
            <textarea
              onChange={(e) => {
                setTask({ ...task, description: e.target.value });
              }}
              className="block mt-2 border-black border-3 w-full rounded-xl p-2 h-36"
            ></textarea>
          </div>

          <div className="flex flex-row justify-around mt-20">
            <div className="flex flex-col items-center">
              <label className="font-semibold text-lg mb-2">Select Team</label>
              <select
                value={team}
                onChange={selectTeam}
                className="h-12 rounded-xl my-2 border-2 border-gray-400 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out"
              >
                <option value="" disabled>
                  Select a team
                </option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col items-center">
              <label className="font-semibold text-lg mb-2">Select User</label>
              <select
                value={user}
                className="h-12 rounded-xl my-2 border-2 border-gray-400 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out"
                onChange={(e) => setUser(e.target.value)}
              >
                <option value="" disabled>
                  Select a user
                </option>
                {users.length > 0 &&
                  users.map((user) => (
                    <option key={user._id} value={user.email}>
                      {user.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <label className="font-semibold text-lg mb-2">Deadline</label>
            <input
              className="h-12 rounded-xl my-2 border-2 border-gray-400 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out"
              type="date"
              onChange={(e) => {
                setTask({ ...task, deadline: e.target.value });
              }}
            />
          </div>

          <p className="text-red-600 h-8 font-normal">{message}</p>

          <button
            type="submit"
            className="basis-1/2 flex bg-[#023E8A] font-medium text-white py-3 rounded-xl justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-200 ease-in-out"
          >
            Assign Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
