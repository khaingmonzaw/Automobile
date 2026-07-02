import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login'; // Login component နာမည်
import Customer from './Customer'; // ဆောက်ထားတဲ့ ဖိုင်အသစ်
import LoginPage from './LoginPage';
import Dashboard from './User/Dashborad';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout'; 
import Userlist from './Admin/Userlist';
import Adduser from './Admin/Adduser';
import UserDetail from "./Admin/UserDetail";
import { Routes, Route , Navigate} from "react-router-dom";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  return(

  <Routes>
    { /* <Route path="/LoginPage" element={<LoginPage />} />
      <Route path="/" element={<Layout />}>
        <Route path="/User/Dashboard" element={<Dashboard />} />
      </Route>
    
     Admin Routes  */}
     <Route path="/" element={<Navigate to="/Admin/Dashboard" />} />
      <Route path="/Admin" element={<AdminLayout />}>
        <Route path="Dashboard" element={<h1>Admin Dashboard Page</h1>} />
        <Route path="Users" element={<Userlist/>} />
        <Route path="Coverage" element={<h1>Coverage Page</h1>} />
        <Route path="Adduser" element={<Adduser />} />
        <Route path="Adduser/:id" element={<Adduser />} />
        <Route path="UserDetail/:id" element={<UserDetail />} />
      </Route>
    </Routes>
  );
}

export default App;