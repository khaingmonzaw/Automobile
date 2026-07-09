//Adduser

const bcrypt = require("bcrypt");

exports.userLists = (db) => {
  return async (req, res) => {
    const sql = `
    SELECT 
        u.id AS User_ID, 
        u.name AS User_Name, 
        p.policy_number AS Policy_Number, 
        p.policy_id AS Policy_ID,
        u.claimed_frequency AS Claimed_Freq, 
        u.status 
    FROM users u
    LEFT JOIN policies p ON u.id = p.user_id
    WHERE u.role = 'user'  -- <--- Move Admin 
  `;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  };
};

//khaing mon mon zaw