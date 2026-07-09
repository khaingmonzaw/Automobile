const bcrypt = require("bcrypt");

exports.adminClaims = (db) => {
  return async (req, res) => {
    const sql = `
     SELECT
      c.claim_id AS claim_id,
      c.accident_date AS accident_date,
      c.status,
      c.claimed_amount AS claimed_amount,
      rk.risk_level

    FROM claims c

    JOIN users u 
      ON u.id = c.user_id

    JOIN risk_assessment rk 
      ON rk.user_id = u.id

    ORDER BY c.claim_id DESC
  `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Claims API Error:", err);
        return res.status(500).json({ message: "Database Error" });
      }
      res.json(results || []);
    });
  };
};

//Myint Myat Thu
