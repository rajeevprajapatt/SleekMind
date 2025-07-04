import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user-context';

const Home = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // If already logged in, redirect to /home
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
    else{
      navigate("/");
    }
  })

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Project Manager</h1>
      <p className="mb-6 text-lg text-center max-w-md">
        Manage your teams and ideas in one powerful platform.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="bg-white text-blue-700 px-6 py-2 rounded-md font-semibold hover:bg-blue-100 transition"
      >
        Login
      </button>
    </div>
  );
};

export default Home;
