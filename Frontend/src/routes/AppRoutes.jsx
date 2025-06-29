import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../screen/login'
import Register from '../screen/Register'
import Home from '../screen/Home'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/", element: <div>
      <Home />
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
