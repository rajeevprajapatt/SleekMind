import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { UserProvider } from './context/user-context'
import './index.css'
import AppBackground from './components/layout/AppBackground'

const App = () => {
  return (
    <UserProvider>
      <AppBackground>
        <AppRoutes />
      </AppBackground>
    </UserProvider>
  )
}

export default App
