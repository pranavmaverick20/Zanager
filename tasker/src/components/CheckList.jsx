import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

const CheckList = (props) => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    const getItems = async () => {
      const response = await (
        await fetch(
          `http://localhost:5001/api/checklistitem/getitems/${props.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      ).json();
      if (response.success) setItems(response.items);
    };
    getItems();
  }, [props.id]); // Only fetch items when props.id changes

  const onAdd = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) {
      return; // Prevent adding empty items
    }
    const response = await (
      await fetch(
        `http://localhost:5001/api/checklistitem/createitem/${props.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: 0, rank: 1, text: newItem }),
        }
      )
    ).json();
    if (response.success) {
      setItems((prevItems) => [...prevItems, response.check]);
      setNewItem("");
    }
  };

  const onChangeInput = async (e) => {
    const id = e.target.id;
    const checked = e.target.checked;

    // Update the local state first
    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, status: checked ? 1 : 0 } : item
      )
    );

    // Send the status update to the server
    await fetch(
      `http://localhost:5001/api/checklistitem/status/${id}/${checked ? 1 : 0}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  const onDelete = async (itemId) => {
    const response = await fetch(
      `http://localhost:5001/api/checklistitem/deleteitem/${itemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res.json());

    if (response.success) {
      setItems((items) => items.filter((item) => item._id !== itemId));
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
                  <input
                    onChange={onChangeInput}
                    id={item._id}
                    type="checkbox"
                    className="mx-3"
                    checked={item.status === 1} // Determine checked status
                  />
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
          />
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

export default CheckList;
