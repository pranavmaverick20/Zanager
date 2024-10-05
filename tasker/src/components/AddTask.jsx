import React, { useContext, useEffect } from "react";
import { CredCheckContext } from "../context/CredCheckContext";

const AddTask = () => {
  const { checkLogin, checkVerify } = useContext(CredCheckContext);
  useEffect(() => {
    checkLogin();
    checkVerify();
  });
  return <div>AddTask</div>;
};

export default AddTask;
