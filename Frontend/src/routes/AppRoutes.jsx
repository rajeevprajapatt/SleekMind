import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../screen/Login'
import Register from '../screen/Register'
import Home from '../screen/Home'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from '../screen/Dashboard'
import Project from '../screen/Project'
import UploadExample from '../screen/UploadExample'

const router = createBrowserRouter([
  {
    path: "/", element: <div>
      <Home />
    </div>
  },
  {
    path: "/dashboard", element: <div>
      <Dashboard />
    </div>
  },
  {
    path: "/login", element: <div>
      <Login />
    </div>
  },
  {
    path: "/register", element: <div>
      <Register />
    </div>
  },
  {
    path: "/project", element: <div>
      <Project />
    </div>
  },
  {
    path: "/upload-example", element: <div>
      <UploadExample />
    </div>
  }
])

const AppRoutes = () => {
  return (
    <RouterProvider router={router} />
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<Home />}></Route>
    //     <Route path="/login" element={<Login />}></Route>
    //     <Route path="/register" element={<Register />}></Route>
    //   </Routes>
    // </BrowserRouter>
  )
}

export default AppRoutes