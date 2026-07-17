//Adduser

const bcrypt = require("bcrypt");

exports.checkDuplicate = (db) => {
  return async (req, res) => {
    const { field, value, userId } = req.query; 

    const allowedFields = [
      "email",
      "phone",
      "nrc",
      "driver_license",
      "policy_number",
      "vehicle_number",
    ];
    if (!allowedFields.includes(field))
      return res.status(400).json({ message: "Invalid field" });

    let sql = "";
    let params = [value];

    if (field === "policy_number") {
      sql = `SELECT COUNT(*) AS count FROM policies WHERE policy_number = ? AND user_id != ?`;
      params.push(userId || 0);
    } else if (field === "vehicle_number") {
      sql = `SELECT COUNT(*) AS count FROM vehicles WHERE vehicle_number = ? AND vehicle_id NOT IN (SELECT vehicle_id FROM policies WHERE user_id = ?)`;
      params.push(userId || 0);
    } else {
      sql = `SELECT COUNT(*) AS count FROM users WHERE ${field} = ? AND id != ?`;
      params.push(userId || 0);
    }
    db.query(sql, params, (err, results) => {
      if (err) return res.status(500).json({ message: "Database Error" });
      res.json({ isUsed: results[0].count > 0 });
    });
  };
};

//Khaing Mon Mon Zaw
