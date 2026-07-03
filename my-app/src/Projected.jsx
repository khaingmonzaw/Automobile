import React from 'react';
import {Link, Navigate} from "react-router-dom";


function Projected({role,children}) {

    const user=JSON.parse(localStorage.getItem("user"));

    if(!user){
        alert("Login First!!!!")
        return <Navigate to="/" replace/>
    }

    if(role && user.role !== role){
        return <Navigate to="/" replace/>
    }
  return children;
  
}

export default Projected