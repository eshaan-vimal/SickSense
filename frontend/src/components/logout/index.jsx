import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'

const Header = () => {
  const navigate = useNavigate()
  const { userLoggedIn } = useAuth()

  // 1) Create a separate function for logout
  const handleLogout = async () => {
    try {
      await doSignOut();        // Sign out from Firebase
      navigate('/login');       // Redirect to login
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  }

  return (
    <nav className='b'>
      {
        userLoggedIn
          ? (
            <button
              onClick={handleLogout}
              className='text-sm text-blue-600 underline'
            >
              Logout
            </button>
          )
          : (
            <>
              {/*  
                Place your Login/Register buttons or links here
                if you need them for non-logged-in users.
              */}
            </>
          )
      }
    </nav>
  )
}

export default Header
