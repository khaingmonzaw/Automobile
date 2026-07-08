//Adduser

const bcrypt = require("bcrypt");

exports.getCoverageByPolicy = (db) => {
  return async (req, res) => {
    const policyId = req.params.policyId;
    const sql = `
    SELECT ct.coverage_type_id, ct.coverage_type
    FROM coverage_policies cp
    JOIN coverage_types ct
      ON cp.coverage_type_id = ct.coverage_type_id
    WHERE cp.policy_id = ?
  `;

    db.query(sql, [policyId], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "DB Error" });
      }

      res.json(results);
    });
  };
};
//Eaint Thiri Phyo