import { useState } from 'react';

function Customer() {
  // Database နဲ့ ကိုက်ညီအောင် state တည်ဆောက်ခြင်း
  const [formData, setFormData] = useState({
    customer_id: '', 
    claim_details: '',
    status: 'Pending' // default အနေနဲ့ Pending လို့ထားမယ်
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/api/add-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (response.ok) {
        alert('Claim submitted successfully!');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to server');
    }
  };
  return (
    <div style={{ padding: '20px' }}>
      <h2>Customer Claim Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Customer ID: </label>
        <input 
          type="text" 
          onChange={(e) => setFormData({...formData, customer_id: e.target.value})} 
          required 
        /><br/><br/>
        <label>Claim Details: </label>
        <input 
          type="text" 
          onChange={(e) => setFormData({...formData, claim_details: e.target.value})} 
          required 
        /><br/><br/>
        <button type="submit">Submit Claim</button>
      </form>
    </div>
  );
}
export default Customer;