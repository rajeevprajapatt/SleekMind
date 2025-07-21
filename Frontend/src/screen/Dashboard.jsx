import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user-context'
import axios from "../config/axios"
import Navbar from '../components/Navbar'

const Dashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  function createProject(e) {
    e.preventDefault();
    axios.post("/projects/create", {
      name: projectName,
    }).then((res) => {
      setIsModalOpen(false);
      setProjectName("");
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
        setProjects(response.data.projects);
      }).catch(err => {
        console.error("Error fetching projects:", err);
      })
    }
  }, [user]);


  return (
    <main className='p-4'>
      <Navbar />
      <div className="pt-3" />
      <div className="projects">
        <button onClick={() => setIsModalOpen(true)} className="project p-4 border border-slate-300 rounded-md">
          <i className="ri-link mr-2" ></i>New Project
        </button>
      </div>
      {/* <h1>{JSON.stringify(user)}</h1> */}
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
              <span className="text-xs text-gray-500">{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '2025-07-05'}</span>
            </div>
            <div className="mt-1 text-sm text-gray-600 font-semibold">
              <i className="ri-team-line font-normal text-lg"></i> Collaborators : {project.users ? project.users.length : 0}
            </div>
          </div>
        ))}
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


