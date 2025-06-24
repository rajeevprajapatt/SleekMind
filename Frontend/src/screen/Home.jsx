import React, { useContext } from 'react'
import { UserContext } from '../context/user-context'

const Home = () => {
  const { user } = useContext(UserContext)

  return (
    <div>
      {JSON.stringify(user)}
      <h1>Hello G</h1>
    </div>
  )
} 

export default Home
