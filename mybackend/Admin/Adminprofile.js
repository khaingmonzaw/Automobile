const express = require('express');
const router = express.Router();

// Express Route: GET Admin Profile by User ID
// Endpoint: GET /api/admin/users/:id
module.exports = (db) => {
  router.get('/users/:id', (req, res) => {
    const userId = req.params.id;

    // MySQL Query - users table မှ အချက်အလက်များ ဆွဲထုတ်ခြင်း
    const sql = `
      SELECT 
        id,
        name,
        email,
        phone,
        role,
        nrc,
        dob,
        address,
        created_at
      FROM users 
      WHERE id = ?
    `;

    db.query(sql, [userId], (err, results) => {
      // Database Error စစ်ဆေးခြင်း
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ 
          message: "Internal Server Error. Failed to fetch admin profile." 
        });
      }

      // User မရှိပါက 404 Return ပြန်ခြင်း
      if (results.length === 0) {
        return res.status(404).json({ 
          message: "Admin profile not found." 
        });
      }

      // Single Object အဖြစ် Response ပြန်ပေးခြင်း
      return res.status(200).json(results[0]);
    });
  });

  return router;
};