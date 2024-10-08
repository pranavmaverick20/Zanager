import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import HomeRight from "./HomeRight";
import { FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import { GlobalTeamsContext } from "../context/GlobalTeamsContext";

const Home = () => {
  const { teams, setTeams } = useContext(GlobalTeamsContext);
  const navigate = useNavigate();
  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("authtoken");
      if (token) {
        const response = await fetch("http://localhost:5001/api/auth/getuser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authtoken: token,
          },
        });
        const data = await response.json();
        if (!data.user.isVerified) {
          navigate("/verify");
        }
      }
    };
    getUser();
  }, []);

  return (
    <div className="h-screen w-full bg-gradient-to-tl flex flex-col from-[#98edb0] bg-[#023E8A] text-neutral-50">
      <h1 className="text-5xl mt-12 font-bold  text-[#98edb0] mx-10">
        My Dashboard
      </h1>
      <div className=" flex flex-row">
        <Board className />
        <HomeRight />
      </div>
    </div>
  );
};

const Board = () => {
  const [cards, setCards] = useState([]);

  const getColumn = (status) => {
    if (status == 0) {
      return "assigned";
    } else if (status == 1) {
      return "inp";
    } else {
      return "completed";
    }
  };

  useEffect(() => {
    const getTasks = async () => {
      const response = await fetch("http://localhost:5001/api/tasks/mytasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
      });
      const result = await response.json();
      const tasksInFormat = result.tasks.map((task) => {
        return {
          task, // Keep the full task object
          title: task.title,
          id: task._id, // Use the Mongoose Object ID
          column: getColumn(task.status),
        };
      });
      setCards(tasksInFormat);
    };
    getTasks();
  }, []);

  return (
    <div className="flex h-full w-full gap-3 overflow-scroll p-12">
      <Column
        title="Assigned"
        column="assigned"
        headingColor="text-red-400"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="In progress"
        column="inp"
        headingColor="text-yellow-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Completed"
        column="completed"
        headingColor="text-blue-200"
        cards={cards}
        setCards={setCards}
      />
      <div className="mx-3"></div>
      <BurnBarrel setCards={setCards} />
    </div>
  );
};

const Column = ({ title, headingColor, cards, column, setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = async (e) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };

      await fetch(`http://localhost:5001/api/tasks/status/${cardId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
        body: JSON.stringify({
          status: column === "inp" ? 1 : column == "completed" ? 2 : 0,
        }),
      });

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((c) => {
          return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
        })}
        <DropIndicator beforeId={null} column={column} />
      </div>
    </div>
  );
};

const Card = ({ title, id, column, handleDragStart }) => {
  const navigate = useNavigate();
  const onClick = (e) => {
    navigate(`/task/${localStorage.getItem("authtoken")}/${id}`);
  };
  return (
    <div className="hover:cursor-pointer hover:scale-105 transition-all ease-in-out duration-200">
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        onClick={onClick}
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { title, id, column })}
        className="rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{title}</p>
      </motion.div>
    </div>
  );
};

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

const BurnBarrel = ({ setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = async (e) => {
    const cardId = e.dataTransfer.getData("cardId");

    setCards((pv) => pv.filter((c) => c.id !== cardId));

    await fetch(`http://localhost:5001/api/tasks/deletebyid/${cardId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authtoken: localStorage.getItem("authtoken"),
      },
    });

    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center  rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

export default Home;
