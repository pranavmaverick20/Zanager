import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [match, setMatch] = useState(true);
  const [ve, setVe] = useState(true);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const response = await (
      await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Add this line
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      })
    ).json();
    if (!response.success) {
      if (response.code == "edne") {
        setMessage("*Email does not exists");
        return;
      } else {
        setMessage("*Invalid credentials");
        return;
      }
    } else {
      localStorage.setItem("authtoken", response.authtoken);
      navigate("/");
      return;
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-tl from-[#98edb0] bg-[#023E8A]">
      <div className="bg-gray-200 shadow-2xl min-w-[25%] min-h-[30%] rounded-3xl mb-20">
        <form
          onSubmit={onSubmit}
          className="px-7 py-8 flex flex-col justify bg-center space-y-4"
        >
          <p className="text-3xl font-bold text-gray-800">
            Login to your account
          </p>

          <div className="w-full">
            <label className="py-4 text-md mx-1 font-medium text-gray-700">
              Email
            </label>
            <input
              onChange={onChange}
              name="email"
              type="email"
              minLength={5}
              value={credentials.email}
              className="block mt-2 border-black border-3 w-full rounded-xl p-2 h-12"
            ></input>
          </div>
          <div className="w-full">
            <label className="py-4 mx-1 text-md font-medium text-gray-700">
              Password
            </label>
            <input
              className="block mt-2 border-black border-3 w-full rounded-xl p-2 h-12"
              type="password"
              onChange={onChange}
              name="password"
              value={credentials.password}
              minLength={8}
            ></input>
          </div>
          <p className="text-red-600 h-8 font-normal">{message}</p>

          <button
            type="submit"
            className="basis-1/2 flex bg-[#023E8A] font-medium text-white py-3 rounded-xl justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-200 ease-in-out"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
