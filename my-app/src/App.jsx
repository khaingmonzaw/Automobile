import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
 
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './LoginPage';
import Dashboard from './User/Dashborad';
import NewClaim from './User/NewClaim';
import MyClaims from './User/MyClaims';
import Layout from './components/Layout';
import ClaimDetails from './User/ClaimDetails';

import AdminDashboard from './Admin/AdminDashboard.jsx';
import AllClaims from './Admin/AllClaims.jsx';
import Profile from './User/Profile.jsx';

// import ClaimApprovalDetails from './Admin/ClaimApprovalDetails';
import CoverageTypes from './Admin/CoverageTypes.jsx';
import NewCoverage from './Admin/NewCoverage.jsx';
import CoverageUpdate from './Admin/CoverageUpdate.jsx';

// import ClaimDetailApproved from './Admin/ClaimDetailApproved'
import PasswordChangeUser from './User/PasswordChangeUser.jsx';
import PasswordChangeAdmin from './Admin/PasswordChangeAdmin.jsx';
import ClaimStatusAction from './Admin/ClaimStatusAction';
import Projected from "./Projected.jsx"
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  return (

    <Routes>



      <Route path="/" element={<LoginPage />} />

      <Route path="/LoginPage" element={<LoginPage />} />

      <Route
        path="/User"
        element={
          <Projected role="user">
            <Layout />
          </Projected>
        }
      >
        <Route index element={<Navigate to="Dashboard" replace />} />
        <Route path="Dashboard" element={<Dashboard />} />
        <Route path="MyClaims" element={<MyClaims />} />
        <Route path="NewClaim" element={<NewClaim />} />
        <Route path="Profile" element={<Profile />} />
        <Route path="MyClaims/ClaimDetails/:id" element={<ClaimDetails />} />
        <Route path="PasswordChangeUser" element={< PasswordChangeUser />} />
      </Route>



      <Route path="/Admin" element={<Layout />}>
        <Route index element={<Navigate to="ClaimDetailApproved" replace />} />
        <Route path="AdminDashboard" element={<AdminDashboard />} />
        <Route path="AllClaims" element={<AllClaims />} />
        {/* <Route path="ClaimDetailApproved" element={<ClaimDetailApproved />} /> */}
        <Route path="CoverageTypes" element={<CoverageTypes />} />
        <Route path="CoverageTypes/NewCoverage" element={<NewCoverage />} />
        <Route path="CoverageTypes/CoverageUpdate/:coverageId" element={<CoverageUpdate />} />
        {/* <Route path="ClaimApprovalDetails" element={<ClaimApprovalDetails />} /> */}
        <Route path="PasswordChangeAdmin" element={< PasswordChangeAdmin />} />
        <Route path="ClaimStatusAction/:id" element={< ClaimStatusAction />} />

        {/* <Route path="Adduser" element={<Adduser />} />
        <Route path="Adduser/:id" element={<Adduser />} />
        <Route path="UserDetail/:id" element={<UserDetail />} />
         <Route path="Users" element={<Userlist/>} /> */}
      </Route>




    </Routes>



  )




  // if (!isLoggedIn) {
  //   return <Login onLoginSuccess={(userRole) => {
  //     setIsLoggedIn(true);
  //     setRole(userRole);
  //   }} />;
  // }


  // return (
  //   <div>
  //     {role === 'user' ? <Customer /> : <h1>Welcome, Staff Member!</h1>}
  //     <button onClick={() => setIsLoggedIn(false)}>Logout</button>
  //   </div>
  // );
}
 
export default App;
