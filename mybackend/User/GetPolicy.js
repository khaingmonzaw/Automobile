//Adduser

const bcrypt = require("bcrypt");

exports.getPolicy = (db) => {
  return async (req, res) => {
    const userId = req.params.userId;

    const updateSql = `
    UPDATE policies
    SET status = 'inactive'
    WHERE end_date < CURDATE()
      AND status = 'active';
  `;

    db.query(updateSql, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "DB Error while updating policies" });
      }

      const sql = `
      SELECT
        p.policy_id,
        p.policy_number,
        v.vehicle_number,
        v.vehicle_model,
        p.remaining_balance
      FROM policies p
      JOIN vehicles v
        ON p.vehicle_id = v.vehicle_id
      WHERE p.user_id = ?
        AND p.status = 'active';
    `;

      db.query(sql, [userId], (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "DB Error while fetching policies" });
        }

        res.json(results);
      });
    });
  };
};


//Eaint Thiri Phyo
