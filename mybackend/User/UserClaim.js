//Adduser

const bcrypt = require("bcrypt");

exports.userClaim = (db) => {
  return async (req, res) => {
    const userId = req.params.userId;

    const sql = `
    SELECT
    c.claim_id,
    c.accident_date,
    c.status,
    c.claimed_amount,
    c.description,
p.policy_number,
v.vehicle_number
    FROM claims c
    JOIN policies p ON p.policy_id = c.policy_id
    Join vehicles v On v.vehicle_id = p.vehicle_id
   WHERE c.user_id = ?
    ORDER BY c.claim_id DESC
  `;

    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error("Claims API Error:", err);
        return res.status(500).json({ message: "DB Error" });
      }

      if (results.length === 0) {
        return res.json({
          message: "No claims found",
          data: [],
        });
      }

      res.json(results);
    });
  };

};


//Eaint Thiri Phyo
