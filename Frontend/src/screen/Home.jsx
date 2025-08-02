import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user-context';
import Navbar from '../components/Navbar';
import image from '../assets/freepik__adjust__7289-removebg-preview.png'

const Home = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (

    <div className='h-screen '>
      <div className="pt-1" />
      <Navbar />
      <div className="pt-1" />
      <div className="w-full h-[30rem] flex flex-col items-center justify-center bg-white text-white px-4">
        <img src={image}></img>
      </div>
    </div>

  );
};

export default Home;
