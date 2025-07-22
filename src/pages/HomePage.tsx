import React from 'react'
import { Link } from 'react-router-dom'
const HomePage = () => {
  return (
    <>
      <div>HomePage</div>
      <div>
        <Link to="/login">Go to Login</Link>
      </div>
      <div>
        <Link to="/signup">Go to Sign Up</Link>
      </div>
    </>
  )
}

export default HomePage