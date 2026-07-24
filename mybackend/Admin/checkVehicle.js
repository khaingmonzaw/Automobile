const bcrypt = require("bcrypt");

exports.checkVehicle = (db) => {
  return async (req, res) => {

    const { vehicle_number } = req.query;

    const sql = `
      SELECT 
        v.vehicle_id,
        p.policy_id,
        p.status
      FROM vehicles v
      LEFT JOIN policies p
      ON v.vehicle_id = p.vehicle_id
      WHERE v.vehicle_number = ?
      ORDER BY p.policy_id DESC
      LIMIT 1
    `;


    db.query(sql, [vehicle_number], (err, results) => {

      if (err) {
        return res.status(500).json({
          message: "Database Error"
        });
      }


      // Vehicle does not exist
      if (results.length === 0) {

        return res.json({
          isUsed: false
        });

      }


      const vehicle = results[0];


      // Vehicle has active policy
      if (vehicle.status === "active") {

        return res.json({
          isUsed: true
        });

      }


      // Vehicle exists but policy inactive
      return res.json({
        isUsed: false
      });


    });

  };
};

//Khaing Mon Mon Zaw
