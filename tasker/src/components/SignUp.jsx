import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [match, setMatch] = useState(true);
  const [ve, setVe] = useState(true);
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpass: "",
  });
  const navigate = useNavigate();
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (credentials.password !== credentials.cpass) {
      setMatch(false);
      return;
    } else {
      if (!match) setMatch(true);
    }
    const response = await (
      await fetch("http://localhost:5001/api/auth/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Add this line
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
        }),
      })
    ).json();
    if (!response.success) {
      if (response.code === "eae") {
        setVe(false);
        return;
      }
    } else {
      localStorage.setItem("authtoken", response.authtoken);
      navigate("/verify"); //navigate to verification page
      setVe(true);
      return;
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-tl from-[#98edb0] bg-[#023E8A]">
      <div className="bg-gray-200 shadow-2xl min-w-[25%] min-h-[50%] rounded-3xl mb-20">
        <form
          onSubmit={onSubmit}
          className="px-7 py-8 flex flex-col justify bg-center space-y-4"
        >
          <p className="text-4xl font-bold text-gray-800">Sign Up!</p>
          <div className="w-full">
            <label className="py-4 mx-1 text-md font-medium text-gray-700">
              Name
            </label>
            <input
              onChange={onChange}
              name="name"
              value={credentials.name}
              className="block mt-2 border-black border-3 w-full rounded-xl p-2 h-12"
            ></input>
          </div>
          <div className="w-full">
            <label className="py-4 mx-1 text-md font-medium text-gray-700">
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
            {!ve && (
              <p className="text-red-600 h-12 font-normal">
                *User already exists
              </p>
            )}
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
          <div className="w-full">
            <label className="py-4 mx-1 text-md font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              className="block mt-2 border-black border-3 w-full rounded-xl p-2 h-12"
              type="password"
              onChange={onChange}
              name="cpass"
              value={credentials.cpass}
            ></input>
            <p className="text-red-600 h-8 mt-3 font-normal">
              {!match && "*Passwords do not match"}
            </p>
          </div>
          <button
            type="submit"
            className="basis-1/2 flex bg-[#023E8A] font-medium text-white py-3 rounded-xl justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-200 ease-in-out"
          >
            Sign Up!
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
