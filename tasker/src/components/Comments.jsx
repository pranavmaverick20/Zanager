import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

const Comments = (props) => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    const getItems = async () => {
      const response = await (
        await fetch(`http://localhost:5001/api/comments/task/${props.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();
      if (response.success) setItems(response.comments);
    };
    getItems();
  }, []);

  const onAdd = async (e) => {
    e.preventDefault();
    const response = await (
      await fetch("http://localhost:5001/api/comments/writecomment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
        body: JSON.stringify({ id: props.id, text: newItem }),
      })
    ).json();
    setItems((prevItems) => [...prevItems, response.newcom]);
    setNewItem("");
  };

  //   const onChangeInput = async (e) => {
  //     const response = await (
  //       await fetch(
  //         `http://localhost:5001/api/checklistitem/status/${e.target.id}/${
  //           e.target.checked ? 1 : 0
  //         }`,
  //         {
  //           method: "PATCH",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       )
  //     ).json();
  //   };

  const onDelete = async (itemId) => {
    const response = await fetch(
      `http://localhost:5001/api/comments/comment/${itemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
      }
    ).then((res) => res.json());
    if (response.success) {
      setItems(items.filter((item) => item._id !== itemId));
    }
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="grid grid-flow-row max-h-64 overflow-auto">
        {items.length > 0 &&
          items.map((item) => {
            return (
              <div
                key={item._id}
                className="flex flex-row justify-between pr-5"
              >
                <label className="flex flex-row items-center content-center h-8 text-xl">
                  {item.text}
                </label>
                <FontAwesomeIcon
                  className="hover:cursor-pointer"
                  onClick={() => onDelete(item._id)}
                  icon={faTrashCan}
                />
              </div>
            );
          })}
      </div>
      <div className="flex flex-row justify-between mb-10">
        <div className="flex flex-row justify-between w-full mr-5 items-center">
          <input
            className="h-8 mx-4 px-2 w-full bg-white rounded-lg border-black border"
            onChange={(e) => {
              setNewItem(e.target.value);
            }}
            value={newItem}
          ></input>
          <p
            onClick={onAdd}
            className="font-light text-3xl hover:cursor-pointer text-gray-400"
          >
            +
          </p>
        </div>
      </div>
    </div>
  );
};

export default Comments;
