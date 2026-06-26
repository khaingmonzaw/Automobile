import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './Login'; // Login component နာမည်
import Customer from './Customer'; // ဆောက်ထားတဲ့ ဖိုင်အသစ်
import LoginPage from './LoginPage';
import Dashboard from './User/Dashborad';
import Layout from './components/Layout';
import { Routes, Route } from "react-router-dom";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  return(

  <Routes>
     <Route path="/LoginPage" element={<LoginPage />} />
      <Route path="/" element={<Layout />}>
        <Route path="/User/Dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  )


 
  // Login မဝင်ရသေးရင် Login Page 
  // if (!isLoggedIn) {
  //   return <Login onLoginSuccess={(userRole) => {
  //     setIsLoggedIn(true);
  //     setRole(userRole);
  //   }} />;
  // }

  // Login ဝင်ပြီးသွားရင် Role ပေါ်မူတည်ပြီး Page ခွဲ
  // return (
  //   <div>
  //     {role === 'user' ? <Customer /> : <h1>Welcome, Staff Member!</h1>}
  //     <button onClick={() => setIsLoggedIn(false)}>Logout</button>
  //   </div>
  // );
}

export default App;