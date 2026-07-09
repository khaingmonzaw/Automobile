//Adduser

const bcrypt = require("bcrypt");

exports.getActiveCoverageType = (db) => {
  return async (req, res) => {
    db.query(
      "SELECT coverage_type_id, coverage_type, coverage_limit FROM coverage_types WHERE status = 'active'",
      (err, results) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json(err);
        }
        res.json(results);
      },
    );
  };
};

//Eaint Thiri Phyo