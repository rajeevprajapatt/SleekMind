import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../screen/login'
import Register from '../screen/Register'
import Home from '../screen/Home'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
