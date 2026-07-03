import 'bootstrap/dist/css/bootstrap.min.css';
<<<<<<< HEAD
 
import Login from './Login'; // Login component နာမည်
=======
>>>>>>> 645a09e (Update PasswordChangeAdmin.jsx)
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './LoginPage';
import Dashboard from './User/Dashborad';
import NewClaim from './User/NewClaim';
import MyClaims from './User/MyClaims';
import Layout from './components/Layout';
import ClaimDetails from './User/ClaimDetails';
//import ClaimApprovalDetails from './Admin/ClaimApprovalDetails';
import CoverageTypes from './Admin/CoverageTypes.jsx';
import NewCoverage from './Admin/NewCoverage.jsx';
import CoverageUpdate from './Admin/CoverageUpdate.jsx';

// Import များ ထပ်ဖြည့်ထားပါတယ်
import ClaimListexample from './Admin/ClaimListexample.jsx'; 
import ClaimDetailApproved from './Admin/ClaimDetailApproved';
 import ClaimStatusAction from './Admin/ClaimStatusAction'; 
import PasswordChangeUser from './User/PasswordChangeUser.jsx';
import PasswordChangeAdmin from './Admin/PasswordChangeAdmin.jsx';
<<<<<<< HEAD
import Projected from "./Projected.jsx"
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

=======

function App() {
>>>>>>> 645a09e (Update PasswordChangeAdmin.jsx)
  return (
    <Routes>
      {/* Login Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/LoginPage" element={<LoginPage />} />

<<<<<<< HEAD
      <Route
        path="/User"
        element={
          <Projected role="user">
            <Layout />
          </Projected>
        }
      >
=======
      {/* User Routes (Layout အောက်မှာ စုထားတာ) */}
      <Route path="/User" element={<Layout />}>
>>>>>>> 645a09e (Update PasswordChangeAdmin.jsx)
        <Route index element={<Navigate to="Dashboard" replace />} />
        <Route path="Dashboard" element={<Dashboard />} />
        <Route path="MyClaims" element={<MyClaims />} />
        <Route path="NewClaim" element={<NewClaim />} />
<<<<<<< HEAD
        <Route path="MyClaims/ClaimDetails/:id" element={<ClaimDetails />} />
        <Route path="PasswordChangeUser" element={< PasswordChangeUser />} />
      </Route>



      <Route path="/Admin" element={<Layout />}>
        <Route index element={<Navigate to="ClaimDetailApproved" replace />} />
        <Route path="ClaimDetailApproved" element={<ClaimDetailApproved />} />
        <Route path="CoverageTypes" element={<CoverageTypes />} />
        <Route path="CoverageTypes/NewCoverage" element={<NewCoverage />} />
        <Route path="CoverageTypes/CoverageUpdate/:coverageId" element={<CoverageUpdate />} />
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
=======
        <Route path="MyClaims/ClaimDetails" element={<ClaimDetails />} />
        <Route path="PasswordChangeUser" element={<PasswordChangeUser />} />
      </Route>

<Route path="/Admin" element={<Layout />}>
  <Route index element={<ClaimListexample />} />
  
  {/* 💡 Sidebar က /admin/claims လို့ခေါ်ရင် ClaimListexample ပွင့်လာမည် */}
  <Route path="Claims" element={<ClaimListexample />} />
  
  {/* 💡 Sidebar က /admin/users လို့ခေါ်ရင် လောလောဆယ် ClaimListexample ပဲပြထားမည် (သို့မဟုတ် သီးသန့် User Component ထည့်ပါ) */}
  <Route path="Users" element={<ClaimListexample />} />
  
  <Route path="ClaimDetailApproved/:id" element={<ClaimDetailApproved />} />
  <Route path="/Admin/ClaimStatusAction/:id" element={<ClaimStatusAction />} />
  <Route path="CoverageTypes" element={<CoverageTypes />} />
  <Route path="CoverageTypes/NewCoverage" element={<NewCoverage />} />
  <Route path="CoverageUpdate/:coverageId" element={<CoverageUpdate />} />
  <Route path="PasswordChangeAdmin" element={<PasswordChangeAdmin />} />
</Route>
      
      </Routes>
  );
>>>>>>> 645a09e (Update PasswordChangeAdmin.jsx)
}
 
export default App;
