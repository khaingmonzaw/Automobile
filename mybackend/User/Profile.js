
const bcrypt = require("bcrypt");

exports.profile = (db) => {

    return async(req,res)=>{

 
  const userId = req.params.userId;
 
 
  const sql = `
   SELECT
    u.name AS fullName,
    u.email,
    u.address,
    u.nrc,
    u.dob,
    u.driver_license,
    u.driver_year,
    u.claimed_frequency,
    u.phone,
    p.status,
    p.policy_number,
    p.start_date,
    p.end_date,
    v.vehicle_number,
    v.vehicle_model,
    v.model_year AS manufactureDate
FROM users u
LEFT JOIN policies p ON u.id = p.user_id
LEFT JOIN vehicles v ON p.vehicle_id = v.vehicle_id
WHERE u.id = ?
LIMIT 1;
  `;
 
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("SQL Error Details:", err); // 💡 Terminal မှာ ပြမယ့် Error ကို သေချာကြည့်ပါ
      return res.status(500).json({ message: "Database Error", details: err });
    }
   
    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
   
    res.json(result[0]);
  });

    }}




   

//Myint Myat Thu   