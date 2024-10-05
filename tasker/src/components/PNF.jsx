import React from "react";

const PNF = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center bg-gradient-to-tl from-[#98edb0] bg-[#023E8A]">
      <div className="py-36 px-48 items-center justify-center">
        <p className="text-9xl font-extrabold my-10 text-gray-400">404.</p>
        <p className="text-3xl font-bold flex px-5 text-gray-400">
          Page not found
        </p>
        <p className="text-xl font-semibold flex px-5 mb-10 text-gray-400">
          The page you were looking for does not exist.
        </p>
        <a className="text-gray-400 m-5 p-4  bg-gray-700 rounded-lg" href="/">
          Go home
        </a>
      </div>
    </div>
  );
};

export default PNF;
