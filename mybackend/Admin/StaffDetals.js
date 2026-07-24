//Adduser

const bcrypt = require("bcrypt");

exports.staffDetails = (db) => {
  return async (req, res) => {
    const userId=req.params.id;

    const sql = `
    SELECT 
       id, 
       name, 
       email, 
       phone, 
       dob,               
      status,     
       nrc,                
       address        
       
    FROM users 
    Where id=?
   
  `;
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.status(500).json(err);
      }
      if (results.length === 0)
        return res.status(404).json({ message: "User not found" });
      res.json(results[0]);
    });
  };
};
