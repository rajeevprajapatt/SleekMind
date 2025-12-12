import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/user-context';
import Navbar from '../components/Navbar';
import image1 from '../assets/Image1.jpg';
import image2 from '../assets/Image2.jpg';
import SplitText from '../animations/SplitText';
import team_chat from '../assets/team_chat.jpg';
import bgImage from '../assets/BG_Image.jpg';
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

  useEffect(() => {
    document.body.style.backgroundImage = `url(${bgImage})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';

    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundAttachment = '';
    };
  }, [bgImage]);

  const tiredCommunication = [
    "Project updates scattered across chats, emails, and docs",
    "Important decisions delayed while waiting for replies",
    "Teams working in silos without visibility into each other's work",
    "Too many apps just to stay in sync",
  ];

  const chatSuitsData = [
    {
      title: "Team chat", description: "Chat across the whole team", details: "Team chat gives you a simple way to talk to everyone in your company, not just those on the same project. Create chat rooms for different teams, goals, or topics. Whether it's a quick question or a broader team discussion, you can stay connected without adding another tool to your stack.",
      image: team_chat
    },
    {
      title: "Project-specific chat", description: "Conversations tied to work", details: "Project-specific chat keeps all discussions related to a project in one place. Team members can easily reference tasks, share updates, and collaborate without losing context. This focused communication helps reduce noise and ensures everyone is aligned on project goals.",
      image: team_chat
    },
  ]

  const TableData = [
    {
      feature: "Built-in project chat in one place",
      breeze: true,
      others: false,
      othersNote: "Most tools depend on separate chat apps",
    },
    {
      feature: "Messages and tasks in one timeline",
      breeze: true,
      others: false,
      othersNote: "Others make you jump between multiple apps",
    },
    {
      feature: "Team chat across all your projects",
      breeze: true,
      others: false,
      othersNote: "Others need tools like Slack for team chat",
    },
    {
      feature: "Conversations linked to actual work",
      breeze: true,
      others: false,
      othersNote: "Others keep chat and tasks unrelated",
    },
    {
      feature: "Everything stays organized in one place",
      breeze: true,
      others: false,
      othersNote: "Others scatter chats across different tools",
    },
  ];


  return (

    <main className='min-h-screen'>
      <Navbar />
      <div className="pt-12" />

      <div className="home-banner w-full">
        <div className='flex flex-col items-center justify-center text-center gap-4 text-white'>
          {fontsReady && (
            <SplitText
              text={
                <>
                  Where your teams and <br /><span className='text-[#2f27ce]'>AI</span> <br />coordinate work together
                </>
              }
              className="md:pt-16 pt-8 pb-5 text-4xl md:text-7xl"
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

          <p className='pb-5 opacity-70 text-sm md:text-2xl'>See how your work connects to goals while working alongside AI that understands your business.</p>
          <div className='flex items-center gap-6 text-lg font-semibold pb-5'>
            {user ? <button onClick={() => navigate("/dashboard")} className='bg-[#2f27ce] text-white flex justify-center gap-1 md:p-4 md:px-7 p-2 px-4 rounded-md'>Dashboard</button>
              : <button onClick={() => navigate("/register")} className='bg-[#2f27ce] text-white flex justify-center gap-1 md:p-4 md:px-7 p-2 px-4 rounded-md'>Get Started</button>
            }
            <button onClick={() => navigate("#")} className='bg-[#dedcff] text-black flex justify-center gap-1 md:p-4 md:px-7 p-2 px-4 rounded-md'>See how it works</button>
          </div>
          <div className='flex md:flex-row flex-col justify-center items-center gap-4 '>
            <div className='md:w-[42%] w-[90%] mx-[5%] md:m-0 rounded-xl'>
              <img src={image1} alt="Home" className='w-full h-full object-cover rounded-xl' />
            </div>
            <div className='md:w-[42%] w-[90%] mx-[5%] md:m-0 rounded-xl'>
              <img src={image2} alt="Home" className='w-full h-full object-cover rounded-xl' />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-24 h-0" />
      <div className='flex flex-col items-center justify-center text-center w-[90%] mx-[5%] rounded-xl bg-black/70 gap-4 text-white '>
        <h1 className='md:pt-16 pt-8 pb-5 md:text-5xl text-4xl font-semibold'>Done with scattered communication?</h1>
        <div className='flex flex-col md:items-start items-start justify-center gap-4 text-white px-2 pb-5 md:text-xl text-md text-left'>
          {tiredCommunication.map((item, index) => {
            return (
              <p key={index} className="flex items-start gap-2">
                <X />
                <span>{item}</span>
              </p>
            )
          })}
        </div>
        <p className='md:text-xl px-2 text-sm pb-8'>With Sleek Mind, everything your team needs is in one place. Chat in real-time, track tasks, <br className='md:flex hidden' />and get AI help without switching tools. Stay organized, make faster decisions,<br className='md:flex hidden' /> and work together smoothly — all in one sleek flow.</p>
      </div>

      <div className="pt-24 h-0" />

      <div className='flex flex-col pb-1 items-center justify-center text-center px-2 gap-4 text-white bg-black/70 w-[90%] mx-[5%] rounded-xl'>
        <h1 className='md:pt-16 pt-8 md:pb-10 md:text-5xl text-4xl font-semibold'>Chat that suits your team</h1>
        {chatSuitsData.map((chat, idx) => {
          return (
            <div className={`flex ${idx % 2 == 0 ? 'md:flex-row' : 'md:flex-row-reverse'} md:flex-row flex-col justify-center w-full text-white pb-10 text-xl md:gap-24 gap-5 md:items-center`}>
              <div className='md:w-1/3 px-2 flex flex-col items-start justify-center gap-2 text-start'>
                <p className='pt-5 text-md'>{chat.title}</p>
                <h1 className='pt-1 pb-1 md:text-4xl text-2xl font-semibold'>{chat.description}</h1>
                <p className='md:text-xl text-md pb-5'>{chat.details}</p>
              </div>
              <div className='md:w-[40%] w-[94%] mx-[3%] md:m-0'>
                <img src={chat.image} alt="Team Chat" className='w-full h-full object-cover rounded-xl' />
              </div>
            </div>
          )
        })}
      </div>

      <div className="pt-24  h-0" />

      <div className='flex flex-col items-center justify-center text-center md:gap-4 gap-2 text-white md:w-[85%] md:mx-[7.5%] w-[94%] mx-[3%] rounded-xl bg-black/70'>
        <h1 className='md:pt-16 pt-8 pb-5 text-4xl font-semibold'>Why your project tool needs chat</h1>
        <div className="overflow-x-auto md:px-4 md:py-6 px-2">
          <table className="min-w-full table-auto border-collapse text-sm md:text-base border-3 border-[#dedcff]">
            <thead>
              <tr className="bg-black/70 text-left text-white">
                <th className="p-4 font-semibold text-white w-1/3"> </th>
                <th className="p-4 font-semibold text-white text-center">Sleek Mind</th>
                <th className="p-4 font-semibold text-white text-center">Others</th>
                <th className="p-4 font-semibold text-white w-1/3"> </th>
              </tr>
            </thead>
            <tbody className='text-start'>
              {TableData.map((row, idx) => (
                <tr
                  key={idx}
                >
                  <td className="md:p-4 p-3 align-top opacity-70 font-semibold">{row.feature}</td>
                  <td className="md:p-4 p-3 text-center">
                    {row.breeze ? (
                      <span className="text-green-600 text-xl">✔</span>
                    ) : (
                      <span className="text-red-500 text-xl">✘</span>
                    )}
                  </td>
                  <td className="md:p-4 p-3 text-center text-gray-600 text-sm">
                    {row.others ? (
                      <span className="text-green-600 text-xl">✔</span>
                    ) : (
                      <span className="text-red-500 text-xl">✘</span>
                    )}
                  </td>
                  <td className="md:p-4 p-3 align-top opacity-70 font-semibold">{row.othersNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </main>

  );
};

export default Home;


function X() {
  return (
    <span className="text-red-500 text-xl flex-shrink-0">✘</span>
  )
}