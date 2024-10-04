import { createContext } from "react";
import { useNavigate } from "react-router-dom";

export const CredCheckContext = createContext();

export const CredCheckState = (props) => {
  const navigate = useNavigate();
  const checkLogin = () => {
    if (!localStorage.getItem("authtoken")) {
      navigate("/");
    }
  };
  const checkVerify = async () => {
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
  return (
    <CredCheckContext.Provider value={{ checkLogin, checkVerify }}>
      {props.children}
    </CredCheckContext.Provider>
  );
};
