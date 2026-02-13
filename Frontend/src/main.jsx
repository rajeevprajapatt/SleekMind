import React from "react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'remixicon/fonts/remixicon.css'

const preloader = document.getElementById("preloader");
if (preloader) preloader.remove();

createRoot(document.getElementById('root')).render(
    <App />
)
