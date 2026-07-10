
const bcrypt = require("bcrypt");

exports.profile = (db) => {
  return async (req, res) => {
    const userId = req.params.userId;

    const sql = `
      SELECT 
        u.name AS fullName, u.email, IFNULL(u.address, '-') AS address, 
        IFNULL(u.phone, '-') AS phone, IFNULL(u.nrc, '-') AS nrc, u.dob,
        IFNULL(p.policy_number, 'No Policy') AS policy_number,p.policy_id, p.start_date, p.end_date, 
        IFNULL(p.status, 'Active') AS status,
        IFNULL(v.vehicle_number, 'No Vehicle') AS vehicle_number, 
        IFNULL(v.vehicle_model, '-') AS vehicle_model,
        IFNULL(v.model_year, '-') AS model_year
      FROM users u
      LEFT JOIN policies p ON u.id = p.user_id
      LEFT JOIN vehicles v ON p.vehicle_id = v.vehicle_id
      WHERE u.id = ?
    `;

    db.query(sql, [userId], (err, result) => {
      if (err) {
        console.error("SQL Error Details:", err);
        return res.status(500).json({ message: "Database Error", details: err });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      //  [0] ကို ဖြုတ်ပြီး ဒေတာ Row ၈ ကြောင်းလုံး (Array) ကို ပို့ပေးလိုက်သည်
      res.json(result); 
    });
  };
};




   

//Myint Myat Thu   