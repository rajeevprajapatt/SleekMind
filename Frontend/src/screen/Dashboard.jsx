import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user-context'
import axios from "../config/axios"
import Navbar from '../components/Navbar'
import video from '../assets/Developer activity.mp4'
import SplitText from '../animations/SplitText';


const sortOptions = [
  { value: "new", label: "Newest" },
  { value: "atoz", label: "A to Z" },
  { value: "ztoa", label: "Z to A" },
  { value: "old", label: "Oldest" },
];


const Dashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [fontsReady, setFontsReady] = useState(false);
  const [selectedSort, setSelectedSort] = useState("new");

  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsReady(true);
    });
  }, []);

  function createProject(e) {
    e.preventDefault();
    axios.post("/projects/create", {
      name: projectName,
    }).then((res) => {
      setIsModalOpen(false);
      setProjectName("");
      window.location.reload();
    })
      .catch((err) => {
        console.error("Error creating project:", err)
      });
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/");
      return;
    }
    else {
      setUser(JSON.parse(storedUser));
    }

  }, [navigate, setUser])

  useEffect(() => {
    if (user) {
      axios.get("/projects/all").then(response => {
        const sorted = sortProjects(response.data.projects, "new");
        console.log(sorted);
        // const sorted = sortProjects(response.data.projects, "new");
        // console.log("Projects fetched:", sorted);
        setProjects(sorted);
      }).catch(err => {
        console.error("Error fetching projects:", err);
      })
    }
  }, [user]);

  const sortProjects = (projectList, type) => {
    const sorted = [...projectList];

    switch (type) {
      case "new":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "old":
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "atoz":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "ztoa":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  }

  const handleSortChange = (e) => {
    const selectedValue = e.target.value;
    // console.log(selectedValue);
    setSelectedSort(selectedValue);
    const sortedProjects = sortProjects(projects, selectedValue);
    setProjects(sortedProjects);
  }

  const renderSortOptions = () => {
    const topOptions = sortOptions.filter(opt => opt.value === selectedSort);
    const otherOptions = sortOptions.filter(opt => opt.value !== selectedSort);
    // Flatten the array and return option elements
    return [...topOptions, ...otherOptions].map(option => (
      <option key={option.value} value={option.value}>
        {option.label}<span><i className="ri-arrow-drop-down-line text-black"></i></span>
      </option>
    ));
  }



  return (
    <main className=''>
      <Navbar />
      <div className="pt-16 w-full" />
      <div className='w-[80%] flex justify-between items-center m-auto pb-5'>
        <div className='w-2/3 h-full p-16'>
          {fontsReady && (
            <SplitText
              text={
                <>
                  Welcome, <span className='text-[#690031]'>{user.fullName}</span> 👋
                </>
              }
              className="text-4xl font-semibold text-black"
              delay={70}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: -5, y: -40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
          )}

          <p className="text-black mt-2 text-xl leading-relaxed">
            Ready to build something amazing today? <br />
            You can <span className="font-medium text-[#690031]">create a new project</span> or
            <span className="font-medium text-[#690031]"> join your existing teams</span> to collaborate in real-time.
          </p>
        </div>
        <div className='w-1/3 flex justify-end items-center'>
          <video className='right-0 w-[80%] mx-auto object-cover' autoPlay loop muted>
            <source src={video} type="video/mp4" />
          </video>
        </div>
      </div>
      <div className="pt-2 bg-[#F7F5F5] h-0" />

      <div className='text-red-500 w-[80%] m-auto mt-10 mb-5'>
        <div className="projects bg-green-500 flex justify-between items-center p-2 rounded-md shadow-md">
          <button onClick={() => setIsModalOpen(true)} className="project py-3 px-8 border border-slate-300 ml-10 rounded-md">
            <i className="ri-link mr-2" ></i>New Project
          </button>
          <select
            className="project-select py-3 px-8 border border-slate-300 rounded-md mr-10 "
            onChange={handleSortChange}
            value={selectedSort}
          >
            {renderSortOptions()} 
          </select>
        </div>
        <div className="projects-list flex flex-col mt-4">
          {projects.map((project) => (
            <div
              key={project._id}
              className="project p-4 border border-slate-300 rounded-md mb-2 cursor-pointer max-w-xl hover:bg-gray-100 transition-colors duration-200"
              onClick={() => navigate(`/project`, {
                state: { project }
              })}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800 pb-1">{project.name}</h2>
                <span className="text-xs text-gray-500">{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '2025-01-01'}</span>
              </div>
              <div className="mt-1 text-sm text-gray-600 font-semibold">
                <i className="ri-team-line font-normal text-lg"></i> Collaborators : {project.users ? project.users.length : 0}
              </div>
            </div>
          ))}
        </div>
      </div>



      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
            <form onSubmit={createProject}>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input
                onChange={(e) => setProjectName(e.target.value)}
                value={projectName}
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project name"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 text-white"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </main>
  )
}

export default Dashboard


