import React, { useContext, useState, useEffect, } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserContext } from '../context/user-context'
import axios from "../config/axios"
import Navbar from '../components/Navbar'
import DeveloperImage from '../assets/Gemini_Generated_Image_nc6jxfnc6jxfnc6j.png'
import SplitText from '../animations/SplitText';
import Footer from '../components/Footer'
import bgImage from '../assets/BG_Image.jpg';
import AnimatedList from '../animations/AnimatedList'


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
  const items = projects.map((project) => (
    <div
      key={project._id}
      className="project border border-slate-300 rounded-md mb-2 cursor-pointer p-2 md:p-4 hover:bg-black/40 transition-all ease-in-out duration-200"
      onClick={() => navigate(`/project`, { state: { project } })}
    >
      {/* Desktop layout */}
      <div className="hidden md:flex justify-between items-center text-white">
        <h2 className="md:text-3xl text-2xl font-semibold opacity-90 flex-1 capitalize">
          {project.name}
        </h2>

        <div className="flex items-center gap-4 text-sm text-gray-200">
          <span>
            <i className="ri-team-line font-normal md:text-lg"></i>{" "}
            Collaborators: {project.users ? project.users.length : 0}
          </span>
          <span className="text-xs">
            {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "2025-01-01"}
          </span>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col md:hidden gap-2">
        <h2 className="text-white text-2xl font-semibold opacity-90 capitalize">
          {project.name}
        </h2>
        <div className="flex justify-between text-sm text-gray-200">
          <span>
            <i className="ri-team-line font-normal"></i>{" "}
            Collaborators: {project.users ? project.users.length : 0}
          </span>
          <span className="text-xs">
            {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "2025-01-01"}
          </span>
        </div>
      </div>

      {/* Description (common) */}
      <div className="mt-1 font-semibold text-sm text-gray-200">
        {project.description ? project.description : "No description"}
      </div>
    </div>
  ));

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
    <main className='' >
      <Navbar />
      <div className="md:pt-32 pt-20 w-full" />
      <div className='md:w-[80%] w-[96%] md:flex md:flex-row-reverse  justify-between items-center mx-[3%] md:m-auto text-[#050315]'>
        <div className='md:w-2/3 w-full h-full md:p-16 p-4'>
          {fontsReady && (
            <SplitText
              text={
                <>
                  Welcome, <span className='text-[#2f27ce]'>{user.fullName}</span> 👋
                </>
              }
              className="text-4xl font-semibold text-white"
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
          <p className="text-slate-100 mt-2 text-xl leading-relaxed opacity-70">
            Ready to build something amazing today? <br />
            You can <span className="font-medium text-[#2f27ce]">create a new project</span> or
            <span className="font-medium text-[#2f27ce]"> join your existing teams</span> to collaborate in real-time.
          </p>
        </div>
        <div className='md:w-1/3 w-full flex md:justify-end justify-center items-center'>
          <img src={DeveloperImage} width='80%'></img>
        </div>
      </div>
      <div className="md:pt-12 pt-8 h-0" />


      <div className='text-slate-800 md:w-[80%] w-[90%] mx-[5%] md:m-auto md:mt-10 mt-1 mb-5'>
        <div className="projects md:text-lg text-md bg-[#433bff] flex justify-between items-center md:p-3 p-3 rounded-md shadow-md">
          <button onClick={() => setIsModalOpen(true)} className="bg-white md:py-3 md:px-8 py-1 px-3 border border-slate-300 md:ml-5 ml-1 rounded-md">
            <i className="ri-link mr-2" ></i>New Project
          </button>
          <select
            className="project-select md:py-3 md:px-8 px-3 py-1 border border-slate-300 rounded-md md:mr-5 mr-2"
            onChange={handleSortChange}
            value={selectedSort}
          >
            {renderSortOptions()}
          </select>
        </div>

        <div className="pt-4 h-0" />
        <AnimatedList
          items={items}
          onItemSelect={(item, index) => console.log(item, index)}
          showGradients
          enableArrowNavigation
          displayScrollbar
        />
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


