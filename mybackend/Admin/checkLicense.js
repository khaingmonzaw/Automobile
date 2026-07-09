
const bcrypt = require("bcrypt");

exports.checkLicense = (db) => {
  return async (req, res) => {
    const { driverLicense } = req.query;
    const sql = "SELECT COUNT(*) AS count FROM users WHERE driver_license = ?";
    db.query(sql, [driverLicense], (err, results) => {
      if (err) return res.status(500).json({ message: "Database Error" });

      // count > 0
      const isUsed = results[0].count > 0;
      res.json({ isUsed });
    });
  };
};
