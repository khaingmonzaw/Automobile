
const bcrypt = require("bcrypt");

exports.checkPolicy = (db) => {
  return async (req, res) => {
    const { number } = req.query;
    const sql =
      "SELECT COUNT(*) AS count FROM policies WHERE policy_number = ?";
    db.query(sql, [number], (err, results) => {
      if (err) return res.status(500).json({ message: "Database Error" });
      // count > 0
      const isUsed = results[0].count > 0;
      res.json({ isUsed });
    });
  };
};

//Khaing Mon Mon Zaw
