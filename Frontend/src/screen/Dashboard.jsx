import React, { useContext, useState, useEffect, } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserContext } from '../context/user-context'
import axios from "../config/axios"
import Navbar from '../components/Navbar'
import DeveloperImage from '../assets/Developer activity.gif'
import SplitText from '../animations/SplitText';
import Footer from '../components/Footer'


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
        {option.label}
      </option>
    ));
  }



  return (
    <main className=''>
      <Navbar />
      <div className="pt-16 w-full" />
      <div className='w-[80%] flex justify-between items-center m-auto text-[#050315]'>
        <div className='w-2/3 h-full p-16'>
          {fontsReady && (
            <SplitText
              text={
                <>
                  Welcome, <span className='text-[#2f27ce]'>{user.fullName}</span> 👋
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

          <p className="text-black mt-2 text-xl leading-relaxed opacity-70">
            Ready to build something amazing today? <br />
            You can <span className="font-medium text-[#2f27ce]">create a new project</span> or
            <span className="font-medium text-[#2f27ce]"> join your existing teams</span> to collaborate in real-time.
          </p>
        </div>
        <div className='w-1/3 flex justify-end items-center'>
          <img src={DeveloperImage} width='80%'></img>
        </div>
      </div>
      <div className="pt-12  h-0" />

      <div className='text-slate-800 w-[80%] m-auto mt-10 mb-5'>
        <div className="projects text-lg bg-[#433bff] flex justify-between items-center p-3 rounded-md shadow-md">
          <button onClick={() => setIsModalOpen(true)} className="project bg-white py-3 px-8 border border-slate-300 ml-5 rounded-md">
            <i className="ri-link mr-2" ></i>New Project
          </button>
          <select
            className="project-select py-3 px-8 border border-slate-300 rounded-md mr-5 "
            onChange={handleSortChange}
            value={selectedSort}
          >
            {renderSortOptions()}
          </select>
        </div>
        <div className="projects-list flex flex-col mt-4 pb-5">
          {projects.length > 0 ? (
            projects.map((project, idx) => (
              <div
                key={project._id}
                className={`project p-4 border border-slate-300 rounded-md mb-2 cursor-pointer min-w-xl hover:bg-slate-100 transition-colors duration-200`}
                onClick={() => navigate(`/project`, {
                  state: { project }
                })}
              >
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <h2 className="text-3xl font-semibold opacity-90 flex-1 min-w-[200px] capitalize">
                    {project.name}
                  </h2>

                  <div className="flex-1 min-w-[150px] text-center text-sm text-gray-500">
                    <i className="ri-team-line font-normal text-lg "></i>
                    {" "}Collaborators: {project.users ? project.users.length : 0}
                  </div>

                  <span className="flex-1 min-w-[150px] text-right text-xs text-gray-500">
                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '2025-01-01'}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-600 font-semibold">
                  <span className="text-sm text-gray-500">{project.description ? project.description : 'No description'}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              <p className="text-lg">No projects found.</p>
              <p className="text-sm">Create a new project to get started!</p>
            </div>
          )}

        </div>

      </div>
      <div className="pt-2 h-0" />

      <Footer />


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


