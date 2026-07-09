
const bcrypt = require("bcrypt");

exports.checkVehicle = (db) => {
  return async (req, res) => {
    const { vehicle_number } = req.query;
    const sql =
      "SELECT COUNT(*) AS count FROM vehicles WHERE vehicle_number = ?";
    db.query(sql, [vehicle_number], (err, results) => {
      if (err) return res.status(500).json({ message: "Database Error" });
      // count > 0
      const isUsed = results[0].count > 0;
      res.json({ isUsed });
    });
  };
};

//Khaing Mon Mon Zaw
