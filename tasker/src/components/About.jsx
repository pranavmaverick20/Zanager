import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="flex items-center flex-col justify-center min-h-screen bg-gradient-to-tl from-[#98edb0] to-[#023E8A]">
      <div className="max-w-2xl p-6 bg-gray-200 rounded-lg shadow-md">
        <h1 className="font-sans text-4xl font-extrabold text-[#023E8A] text-center">
          About Zanager
        </h1>
        <p className="mt-4 font-sans text-lg font-medium text-gray-700 text-center">
          Zanager is your ultimate task management solution designed to help you
          focus on what matters most. Our goal is to provide you with a zen-like
          experience, enabling you to efficiently manage your tasks and projects
          without the clutter and stress.
        </p>
        <p className="mt-4 font-sans text-lg font-medium text-gray-700 text-center">
          With Zanager, you can easily create, organize, and track your tasks in
          a user-friendly environment. Whether you're a student, professional,
          or someone looking to streamline your daily activities, Zanager has
          the features you need to stay on top of your goals.
        </p>
        <h2 className="mt-6 font-sans text-2xl font-bold text-[#023E8A]">
          Key Features:
        </h2>
        <ul className="mt-2 list-disc list-inside text-gray-700">
          <li>🌟 Intuitive Task Creation and Management</li>
          <li>📅 Calendar View for Better Planning</li>
          <li>🗂️ Customizable Task Categories</li>
          <li>🔔 Reminders and Notifications</li>
          <li>🤝 Collaboration with Team Members</li>
          <li>📊 Progress Tracking and Analytics</li>
        </ul>
        <p className="mt-4 font-sans text-lg font-medium text-gray-700 text-center">
          Join our community today and take the first step toward a more
          organized and productive life with Zanager. Experience the peace of
          mind that comes from knowing your tasks are under control.
        </p>

        <div className="flex justify-center mt-6">
          {" "}
          {!localStorage.getItem("authtoken") && (
            <Link to="/signup">
              <button className="text-white font-small flex flex-row items-center justify-center bg-[#50a3fb] py-2 px-4 rounded-xl bg-opacity-95 hover:opacity-100 hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-200 ease-in-out">
                Get Started
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
