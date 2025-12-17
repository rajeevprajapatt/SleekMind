import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../screen/Login'
import Register from '../screen/Register'
import Home from '../screen/Home'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from '../screen/Dashboard'
import Project from '../screen/Project'
import UploadExample from '../screen/UploadExample'
import UserAuth from '../auth/UserAuth'
import Temp from '../screen/Temp'


const router = createBrowserRouter([
  {
    path: "/", element: <div>
      <Home />
    </div>
  },
  {
    path: "/temp", element: <div>
      <Temp />
    </div>
  },
  {
    path: "/dashboard", element: <div>
      <UserAuth><Dashboard /></UserAuth>
      {/* <Dashboard /> */}
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
      <UserAuth><Project /></UserAuth>

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
  )
}

export default AppRoutes