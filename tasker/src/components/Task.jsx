import React, { useContext, useEffect, useState } from "react";
import { CredCheckContext } from "../context/CredCheckContext";
import { useNavigate, useParams } from "react-router-dom";
import CheckList from "./CheckList";
import Comments from "./Comments";

const Task = () => {
  const { at, id } = useParams();
  const { checkLogin, checkVerify } = useContext(CredCheckContext);
  const [pair, setPair] = useState({ assignee: "", reported: "" });
  const navigate = useNavigate();
  const [task, setTask] = useState({
    id: "",
    title: "",
    description: "",
    status: "",
    assigneeId: "",
    reportedId: "",
    deadline: "",
  });

  const getUser = async (id) => {
    return await (
      await fetch(`http://localhost:5001/api/auth/getuser/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
      })
    ).json();
  };

  useEffect(() => {
    const startup = async () => {
      checkLogin();
      checkVerify();

      if (at != localStorage.getItem("authtoken")) {
        navigate("/pnf");
        return;
      }
      const response = await (
        await fetch(`http://localhost:5001/api/tasks/taskbyid/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();
      if (!response.success) {
        navigate("/pnf");
      }
      setTask(response.task);
    };
    startup();
  }, []);

  useEffect(() => {
    const startup = async () => {
      const a = (await getUser(task.assigneeId)).user.name;
      const r = (await getUser(task.reportedId)).user.name;
      setPair({ assignee: a, reported: r });
    };
    if (task.assigneeId && task.reportedId) {
      startup();
    }
  }, [task]);

  return (
    <div className="flex flex-col h-screen space-y-7 w-screen bg-gradient-to-tl from-[#98edb0] to-[#023E8A]">
      <h1 className="text-5xl mt-8 font-bold text-[#98edb0] mx-36 ">
        {task.title}
      </h1>

      <div className="bg-gray-200 my-2 p-6 rounded-lg mx-36 shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800">Task Details</h2>
        <div className="flex flex-col">
          <div>
            <label className="text-sm  p-2">Description</label>
            <p className="h-12 bg-white mt-4 rounded-lg p-3">
              {task.description}
            </p>
          </div>
          <div className="flex flex-row my-6 justify-around">
            <div className="flex space-x-4 items-center flex-row">
              <p>Assigned by:</p>
              <p className="h-12 bg-white rounded-lg p-3">{pair.reported}</p>
            </div>
            <div>
              <div className="flex space-x-4 items-center flex-row">
                <p>Assigned to:</p>
                <p className="h-12 bg-white  rounded-lg p-3">{pair.assignee}</p>
              </div>
            </div>
            <div className="flex space-x-4 items-center flex-row">
              <p>Status:</p>
              <p
                className={`h-12 rounded-lg p-3 ${
                  task.status == 0
                    ? "bg-red-300"
                    : task.status == 1
                    ? "bg-yellow-100"
                    : "bg-green-300"
                }`}
              >
                {task.status == 0
                  ? "Assigned"
                  : task.status == 1
                  ? "In progress"
                  : "Completed"}
              </p>
            </div>
            <div>
              <div className="flex space-x-4 items-center flex-row">
                <p>Deadline</p>
                <p className="h-12 bg-white  rounded-lg p-3">
                  {task.deadline.substring(0, 10).substring(8) +
                    "-" +
                    task.deadline.substring(0, 10).substring(5, 7) +
                    "-" +
                    task.deadline.substring(0, 10).substring(0, 4)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-gray-600"></p>
      </div>
      <div className="flex flex-row mx-36 justify-between space-x-10 min-h-96">
        <div className="bg-white my-2 p-6 rounded-lg w-[50%] shadow-lg ">
          <h2 className="text-2xl font-semibold text-gray-800">Checklist</h2>
          {task._id ? <CheckList id={task._id} /> : <p>Loading...</p>}
        </div>

        <div className="bg-white my-2 p-6 rounded-lg w-[50%] shadow-lg ">
          <h2 className="text-2xl font-semibold text-gray-800">Comments</h2>
          {task._id ? <Comments id={task._id} /> : <p>Loading...</p>}
        </div>
      </div>
    </div>
  );
};
export default Task;
