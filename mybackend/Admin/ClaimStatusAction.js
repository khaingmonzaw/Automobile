
const bcrypt = require("bcrypt");

exports.claimStatusAction = (db) => {
  return async (req, res) => {
    const claim_id = req.params.id; //

    const sql = `
    SELECT 
      claim_id, 
      c.user_id, 
      u.name,
      c.policy_id, 
      accident_type, 
      accident_date, 
      claimed_amount, 
      c.status,
      v.vehicle_number,
    v.vehicle_model,
      remark
    FROM claims c
    JOIN users u ON u.id=c.user_id
    JOIN policies p ON p.policy_id=c.policy_id
    JOIN vehicles v ON v.vehicle_id=p.vehicle_id
    WHERE claim_id = ?
  `;
    //[06/07/2026 13:42] Myoyadanar:
    db.query(sql, [claim_id], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database Error", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Claim not found" });
      }

      res.status(200).json(results[0]);
    });
  };
};

//Myo Yadanar
