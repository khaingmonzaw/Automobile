const bcrypt = require("bcrypt");

exports.changePassword = (db) => {
  return async (req, res) => {
    const { id, currentPassword, newPassword } = req.body;

    if (!id || !currentPassword || !newPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const checkSql = "SELECT * FROM users WHERE id=?";

    db.query(checkSql, [id], async (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Database Error",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const oldHashPassword = results[0].password;

      const isMatch = await bcrypt.compare(currentPassword, oldHashPassword);

      if (!isMatch) {
        //    console.log("Wrong current password");

        return res.status(400).json({
          message: "Current password is incorrect",
        });
      }

      const newHashPassword = await bcrypt.hash(newPassword, 10);

      const updateSql = "UPDATE users SET password=? WHERE id=?";

      db.query(updateSql, [newHashPassword, id], (err) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to update password",
          });
        }

        res.json({
          message: "Password changed successfully",
        });
      });
    });
  };
};
//Myo Yadanar