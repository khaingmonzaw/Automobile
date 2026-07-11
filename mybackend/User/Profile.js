const bcrypt = require("bcrypt");

exports.profile = (db) => {
  return async (req, res) => {
    const userId = req.params.userId;

    
    const sql = `
      SELECT 
        u.name AS fullName, 
        u.email, 
        IFNULL(u.address, '-') AS address, 
        IFNULL(u.phone, '-') AS phone, 
        IFNULL(u.nrc, '-') AS nrc, 
        u.dob,
        p.policy_number, 
        p.start_date, 
        p.end_date, 
        p.status,
        v.vehicle_number, 
        v.vehicle_model,
        v.model_year
      FROM users u
      INNER JOIN policies p ON u.id = p.user_id     
      LEFT JOIN vehicles v ON p.vehicle_id = v.vehicle_id
      WHERE u.id = ? AND p.status = 'active'         
    `;

    db.query(sql, [userId], (err, result) => {
      if (err) {
        console.error("SQL Error Details:", err);
        return res.status(500).json({ message: "Database Error", details: err });
      }

      
      if (result.length === 0) {
        
        return res.status(404).json({ message: "No active policies found for this user." });
      }

      
      res.json(result); 
    });
  };
};