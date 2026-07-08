//Adduser

const bcrypt = require("bcrypt");

exports.checkDuplicate = (db) => {
  return async (req, res) => {
    const { field, value, userId } = req.query; // userId ကိုပါ ထည့်စစ်မယ်

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

    // Logic: ကိုယ့် ID မဟုတ်တဲ့ တခြား record တွေထဲမှာ ဒီ value ရှိနေလား စစ်မယ်
    if (field === "policy_number") {
      sql = `SELECT COUNT(*) AS count FROM policies WHERE policy_number = ? AND user_id != ?`;
      params.push(userId || 0);
    } else if (field === "vehicle_number") {
      // Vehicle တွေမှာ policy_id (သို့) user_id ဆက်စပ်မှုအပေါ်မူတည်ပြီး စစ်ပါ
      sql = `SELECT COUNT(*) AS count FROM vehicles WHERE vehicle_number = ? AND vehicle_id NOT IN (SELECT vehicle_id FROM policies WHERE user_id = ?)`;
      params.push(userId || 0);
    } else {
      // Users table အတွက်
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
