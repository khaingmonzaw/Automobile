import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './Login'; // Login component နာမည်
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './LoginPage';
import Dashboard from './User/Dashborad';
import NewClaim from './User/NewClaim';
import MyClaims from './User/MyClaims';
import Layout from './components/Layout';
import ClaimDetails from './User/ClaimDetails';
import ClaimApprovalDetails from './Admin/ClaimApprovalDetails';
import CoverageTypes from './Admin/coverage_types.jsx';
import NewCoverage from './Admin/new_coverage.jsx';
import CoverageUpdate from './Admin/coverage_update.jsx';

import ClaimDetailApproved from './Admin/ClaimDetailApproved'
import PasswordChangeUser from './User/PasswordChangeUser.jsx';
import PasswordChangeAdmin from './Admin/PasswordChangeAdmin.jsx';
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
        <Route path="MyClaims/ClaimDetails/:id" element={<ClaimDetails />} />
        <Route path="PasswordChangeUser" element={< PasswordChangeUser />} />
      </Route>



      <Route path="/Admin" element={<Layout />}>
        <Route index element={<Navigate to="ClaimDetailApproved" replace />} />
        <Route path="ClaimDetailApproved" element={<ClaimDetailApproved />} />
        <Route path="CoverageTypes" element={<CoverageTypes />} />
        <Route path="CoverageTypes/NewCoverage" element={<NewCoverage />} />
        <Route path="CoverageUpdate/:coverageId" element={<CoverageUpdate />} />
        <Route path="ClaimApprovalDetails" element={<ClaimApprovalDetails />} />
        <Route path="PasswordChangeAdmin" element={< PasswordChangeAdmin />} />
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
