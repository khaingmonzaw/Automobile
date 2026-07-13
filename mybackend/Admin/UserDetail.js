//Adduser

const bcrypt = require("bcrypt");

exports.userDetails = (db) => {
  return async (req, res) => {
    const policyId = req.params.id;
    if (!policyId || policyId === "undefined") {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const sql = `
    SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.phone, 
        u.dob,               
        u.driver_license,     
        u.driver_year,       
        u.nrc,                
        u.address,            
        p.policy_number AS policyNumber, 
        p.status AS policyStatus, 
        p.policy_id,
        p.remaining_balance,
        DATE_FORMAT(p.start_date, '%Y-%m-%d') AS startDate,
        DATE_FORMAT(p.end_date, '%Y-%m-%d') AS endDate,
        p.policy_duration AS policyDuration,
        v.vehicle_number AS vehicleNumber, 
        v.vehicle_model AS vehicleModel,
        v.model_year,
        GROUP_CONCAT(ct.coverage_type_id) AS coverageTypeIds,
        GROUP_CONCAT(ct.coverage_type SEPARATOR ', ') AS coverageType,
        GROUP_CONCAT(ct.coverage_limit SEPARATOR ', ') AS coverageLimit
    FROM policies p
     JOIN users u ON u.id = p.user_id
     JOIN vehicles v ON p.vehicle_id = v.vehicle_id
     JOIN coverage_policies cp ON p.policy_id = cp.policy_id
     JOIN coverage_types ct ON cp.coverage_type_id = ct.coverage_type_id
    WHERE p.policy_id = ?
    GROUP BY  p.policy_id
  `;
    db.query(sql, [policyId], (err, results) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.status(500).json(err);
      }
      if (results.length === 0)
        return res.status(404).json({ message: "User not found" });
      res.json(results[0]);
    });
  };
};
//khaing mon mon zaw