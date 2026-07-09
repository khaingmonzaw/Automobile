//Adduser

const bcrypt = require("bcrypt");

exports.submitClaim = (db) => {
  return async (req, res) => {
    const {
      user_id,
      policy_id,
      accident_type,
      accident_date,
      claimed_amount,
      description,
      location,
    } = req.body;

    // VALIDATION
    if (
      !user_id ||
      !policy_id ||
      !accident_type ||
      !accident_date ||
      !claimed_amount
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const searchSql = `
    SELECT ct.coverage_type
    FROM coverage_policies cp
    JOIN coverage_types ct
      ON cp.coverage_type_id = ct.coverage_type_id
    WHERE cp.policy_id = ?
  `;

    db.query(searchSql, [policy_id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "DB Error" });
      }

      const allowed = results.map((r) => r.coverage_type.toLowerCase().trim());

      const isAllowed = allowed.includes(accident_type.toLowerCase().trim());

      if (!isAllowed) {
        return res.status(400).json({
          message: "This accident type is NOT covered by your policy",
        });
      }

      const insertSql = `
      INSERT INTO claims
      (user_id, policy_id, accident_type, accident_date,
       claimed_amount, description, location, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')
    `;

      db.query(
        insertSql,
        [
          user_id,
          policy_id,
          accident_type,
          accident_date,
          claimed_amount,
          description,
          location,
        ],
        (err) => {
          if (err) {
            return res.status(500).json({ message: "Insert Error" });
          }

          // Increase claimed_frequency by 1
          const updateSql = `
    UPDATE users
    SET claimed_frequency = claimed_frequency + 1
    WHERE id = ?
  `;

          db.query(updateSql, [user_id], (err) => {
            if (err) {
              return res.status(500).json({
                message: "Claim saved, but failed to update claim frequency",
              });
            }

            res.json({
              message: "Claim submitted successfully",
            });
          });
        },
      );
    });
  };
};
//Eaint Thiri Phyo