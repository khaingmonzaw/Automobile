//Adduser

const bcrypt = require("bcrypt");

exports.userLists = (db) => {
  return async (req, res) => {
    /* const updatePolicyStatus = `
      UPDATE policies
      SET status = 'inactive'
      WHERE CURDATE() > DATE_ADD(end_date, INTERVAL 3 DAY)
      AND status = 'active'
    `;


    db.query(updatePolicyStatus, (updateErr,result) => {

      if (updateErr) {
        console.log(updateErr);
        return res.status(500).json(updateErr);
      }
      console.log("Updated Rows:", result.affectedRows);
*/
    const sql = `
    SELECT 
        u.id AS User_ID, 
        u.name AS User_Name, 
        p.policy_number AS Policy_Number, 
        p.policy_id AS Policy_ID,
       COUNT(c.claim_id) AS Claimed_Freq, 
        p.status AS Policy_Status
    FROM users u
    LEFT JOIN policies p ON u.id = p.user_id
     LEFT JOIN claims c
        ON p.policy_id = c.policy_id
    WHERE u.role = 'user'  -- <--- Move Admin 
     GROUP BY 
        u.id,
        u.name,
        p.policy_number,
        p.policy_id,
        p.status
  `;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
     });

    
};
};

//khaing mon mon zaw