import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRouting = () => {

    const isLoggedIn = localStorage.getItem("username");
    
    return ( isLoggedIn != null ? <Outlet/> : <Navigate to="/signin"/>
  )
}

export default ProtectedRouting;