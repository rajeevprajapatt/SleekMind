import React, { useContext, useState } from 'react'
import { UserContext } from '../context/user-context'
import axios from "../config/axios"

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState(null);

  function createProject(e) {
    e.preventDefault();
    axios.post("/projects/create", {
      name: projectName,
    }).then((res) => {
      console.log(res.data)
    })
      .catch((err) => {
        console.error("Error creating project:", err)
      })
      ;
    console.log("Create Project Clicked");
    console.log(projectName);
  }

  return (
    <main className='p-4'>
      <div className="projects">
        <button onClick={() => setIsModalOpen(true)} className="project p-4 border border-slate-300 rounded-md">
          <i className="ri-link mr-2" ></i>New Project
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
            <form
              onSubmit={createProject}
            >
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input
                onChange={(e) => setProjectName(e.target.value)}
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

export default Home
