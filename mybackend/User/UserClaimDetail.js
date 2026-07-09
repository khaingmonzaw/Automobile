//Adduser

const bcrypt = require("bcrypt");

exports.userClaimDetail = (db) => {
  return async (req, res) => {
    const id = req.params.id;

    const sql = `
    SELECT DISTINCT
      c.claim_id,
      c.created_at,
      c.accident_date,
      c.description,
      c.claimed_amount,
      c.compensation_amount,
      c.location,
      c.status,
      c.remark,
      ct.coverage_type AS accident_type,
      v.vehicle_number AS v_number,
      v.vehicle_model AS v_model
    FROM claims c
    JOIN policies p ON c.policy_id = p.policy_id
    JOIN vehicles v ON p.vehicle_id = v.vehicle_id
     JOIN coverage_policies cp ON p.policy_id = cp.policy_id
     JOIN coverage_types ct ON cp.coverage_type_id = ct.coverage_type_id
    WHERE c.claim_id = ?;
  `;

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Not found" });
      }

      res.json(result[0]);
    });
  };
};
//Eaint Thiri Phyo