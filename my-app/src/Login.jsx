import { useState } from 'react';

// 1. ဒီနေရာမှာ props ကို ထည့်ပေးရပါမယ်
function Login(props) { 
  const [role, setRole] = useState('user'); 
  const [formData, setFormData] = useState({ username: '', password: '', customer_id: '' });

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Login Successful!');
        
        // 2. ဒီနေရာမှာ props.onLoginSuccess ကို ခေါ်ရပါမယ်
        props.onLoginSuccess(role); 
      } else {
        alert(data.message || 'Login Failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server connection failed');
    }
  };

  return (
    <div className="login-container" style={{ padding: '20px', maxWidth: '300px', margin: 'auto' }}>
      <h2>{role === 'user' ? 'Customer Login' : 'Staff Login'}</h2>
      
      <button onClick={() => setRole(role === 'user' ? 'staff' : 'user')} style={{ marginBottom: '10px' }}>
        Switch to {role === 'user' ? 'Staff' : 'Customer'} Login
      </button>

      <input 
        type="text" placeholder="Username" 
        onChange={(e) => setFormData({...formData, username: e.target.value})} 
        style={{ display: 'block', marginBottom: '10px', width: '100%' }}
      />
      <input 
        type="password" placeholder="Password" 
        onChange={(e) => setFormData({...formData, password: e.target.value})} 
        style={{ display: 'block', marginBottom: '10px', width: '100%' }}
      />
      <input 
        type="text" placeholder="Customer_ID" 
        onChange={(e) => setFormData({...formData, customer_id: e.target.value})} 
        style={{ display: 'block', marginBottom: '10px', width: '100%' }}
      />
      
      <button onClick={handleLogin} style={{ width: '100%' }}>Login</button>
    </div>
  );
}

export default Login;