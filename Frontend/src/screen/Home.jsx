import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/user-context';
import Navbar from '../components/Navbar';
import image1 from '../assets/Image1.jpg';
import image2 from '../assets/Image2.jpg';
import SplitText from '../animations/SplitText';
import team_chat from '../assets/team_chat.jpg';
import Footer from '../components/Footer';

const Home = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsReady(true);
    });
  }, []);

  const data = [
    {
      feature: "Chat built directly into projects",
      breeze: true,
      others: false,
      othersNote: "Most tools rely on external chat apps or email",
    },
    {
      feature: "One place for messages and task updates",
      breeze: true,
      others: false,
      othersNote: "Other tools make you switch between apps to stay updated",
    },
    {
      feature: "Team chat across all projects",
      breeze: true,
      others: false,
      othersNote: "No need for a separate chat app like Slack",
    },
    {
      feature: "Conversations tied to actual work",
      breeze: true,
      others: false,
      othersNote: "Other tools keep chat and tasks disconnected",
    },
    {
      feature: "Everything stays in one place",
      breeze: true,
      others: false,
      othersNote: "Harder to track down conversations in scattered tools",
    },
  ];

  return (

    <div className='h-screen '>
      <Navbar />
      <div className="pt-12" />

      <div className="home-banner w-full bg-white">
        <div className='flex flex-col items-center justify-center text-center gap-4 text-[#690031]'>
          {fontsReady && (
            <SplitText
              text={
                <>
                  Where your teams and AI <br />coordinate work together
                </>
              }
              className="pt-16 pb-5 text-4xl md:text-7xl"
              delay={80}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: -6, y: -40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
          )}

          <p className='text-2xl pb-5'>See how your work connects to goals while working alongside AI that <br /> understands your business.</p>
          <div className='flex items-center gap-6 text-xl font-semibold pb-5'>
            {user ? <button onClick={() => navigate("/projects")} className='bg-[#690031] text-white flex justify-center gap-1 p-5 rounded-full'>Dashboard</button>
              : <button onClick={() => navigate("/register")} className='bg-[#690031] text-white flex justify-center gap-1 p-5  rounded-full'>Get Started</button>
            }
            <button onClick={() => navigate("#")} className='text-[#690031] border-2 border-[#690031] flex justify-center gap-1 p-5 rounded-full'>See how it works</button>
          </div>
          <div className='flex justify-center items-center mb-12 gap-4 '>
            <div className='w-[42%] bg-green-700 rounded-xl'>
              <img src={image1} alt="Home" className='w-full h-full object-cover rounded-xl' />
            </div>
            <div className='w-[42%] bg-black rounded-xl'>
              <img src={image2} alt="Home" className='w-full h-full object-cover rounded-xl' />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 bg-[#F7F5F5] h-0" />

      <div className='flex flex-col items-center justify-center text-center  gap-4 text-black bg-grey-100'>
        <h1 className='pt-16 pb-5 text-4xl font-semibold'>Tired of messy team communication and <br /> disconnected workflows?</h1>
        <div className='flex flex-col items-start justify-center gap-4 text-black pb-5 text-xl'>
          <p className=''><span className="text-red-500 text-xl">✘</span> Project updates scattered across chats, emails, and docs</p>
          <p className=''><span className="text-red-500 text-xl">✘</span> Important decisions delayed while waiting for replies</p>
          <p className=''><span className="text-red-500 text-xl">✘</span> Teams working in silos without visibility into each other's work</p>
          <p className=''><span className="text-red-500 text-xl">✘</span> Too many apps just to stay in sync</p>
        </div>
        <p className='text-xl pb-5'>With Sleek Mind, everything your team needs is in one place. Chat in real-time, track tasks, <br />and get AI help without switching tools. Stay organized, make faster decisions,<br /> and work together smoothly — all in one sleek flow.</p>
      </div>

      <div className="pt-6" />

      <div className='flex flex-col pb-5 items-center justify-center text-center  gap-4 text-black bg-gradient-to-b from-[#F7F5F5] to-white'>
        <h1 className='pt-16 pb-16 text-4xl font-semibold'>Messaging that fits the way your team <br /> works</h1>
        <div className='flex items-start justify-center w-full text-black pb-16 text-xl gap-24 '>
          <div className='w-1/3 flex flex-col items-start justify-center gap-2 text-start'>
            <p className='pt-5'>Team chat</p>
            <h1 className='pt-1 pb-1 text-4xl font-semibold'>Chat across the whole team</h1>
            <p className='text-xl pb-5'>Team chat gives you a simple way to talk to everyone in your company, not just those on the same project. Create chat rooms for different teams, goals, or topics. Whether it's a quick question or a broader team discussion, you can stay connected without adding another tool to your stack.</p>
          </div>
          <div className='w-[40%]'>
            <img src={team_chat} alt="Team Chat" className='w-full h-full object-cover rounded-xl' />
          </div>
        </div>
        <div className='flex flex-row-reverse items-start justify-center w-full text-black pt-8 pb-5 text-xl gap-24'>
          <div className='w-1/3 flex flex-col items-start justify-center gap-2 text-start'>
            <p className='pt-5'>Team chat</p>
            <h1 className='pt-1 pb-1 text-4xl font-semibold'>Chat across the whole team</h1>
            <p className='text-xl pb-5'>Team chat gives you a simple way to talk to everyone in your company, not just those on the same project. Create chat rooms for different teams, goals, or topics. Whether it's a quick question or a broader team discussion, you can stay connected without adding another tool to your stack.</p>
          </div>
          <div className='w-[40%]'>
            <img src={team_chat} alt="Team Chat" className='w-full h-full object-cover rounded-xl' />
          </div>
        </div>
      </div>

      <div className="pt-2 bg-[#F7F5F5] h-0" />

      <div className='flex flex-col items-center justify-center text-center  gap-4 text-black bg-grey-100'>
        <h1 className='pt-16 pb-5 text-4xl font-semibold'>Why messaging belongs in your project management tool</h1>
        <div className="overflow-x-auto px-4 py-6">
          <table className="min-w-full table-auto border-collapse  text-sm md:text-base">
            <thead>
              <tr className="bg-[#F7F5F5] text-left">
                <th className="p-4 font-semibold text-gray-700 w-1/3"> </th>
                <th className="p-4 font-semibold text-gray-700 text-center">Sleek Mind</th>
                <th className="p-4 font-semibold text-gray-700 text-center">Others</th>
                <th className="p-4 font-semibold text-gray-700 w-1/3"> </th>
              </tr>
            </thead>
            <tbody className='text-start'>
              {data.map((row, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-[#F7F5F5]"}
                >
                  <td className="p-4 align-top opacity-70 font-semibold">{row.feature}</td>
                  <td className="p-4 text-center">
                    {row.breeze ? (
                      <span className="text-green-600 text-xl">✔</span>
                    ) : (
                      <span className="text-red-500 text-xl">✘</span>
                    )}
                  </td>
                  <td className="p-4 text-center text-gray-600 text-sm">
                    {row.others ? (
                      <span className="text-green-600 text-xl">✔</span>
                    ) : (
                      <span className="text-red-500 text-xl">✘</span>
                    )}
                  </td>
                  <td className="p-4 align-top opacity-70 font-semibold">{row.othersNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>

  );
};

export default Home;
