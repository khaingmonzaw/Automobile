const bcrypt = require("bcrypt");
async function generatePolicyNumber(db) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT policy_number FROM policies ORDER BY policy_id DESC LIMIT 1",
      (err, result) => {
        if (err) return reject(err);

        let newNumber = "POL-0001"; 
        if (result.length > 0 && result[0].policy_number) {
          const lastPolicy = result[0].policy_number; 
          const numPart = parseInt(lastPolicy.split("-")[1]); 
          newNumber = `POL-${String(numPart + 1).padStart(4, "0")}`;
        }
        resolve(newNumber);
      }
    );
  });
}
exports.getNextPolicyNumber = (db) => {
  return async (req, res) => {
    try {
      const policyNumber = await generatePolicyNumber(db);

      res.json({
        policyNumber: policyNumber
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Failed to generate policy number"
      });
    }
  };
};
exports.addUser = (db) => {
  return async (req, res) => {
    const {
      fullName,
      email,
      phone,
      dob,
      nrc,
      address,
      driverLicense,
      drivingYear,
      vehicleModel,
      vehicleNumber,
      modelYear,
      coverage,
      startDate,
      endDate,
      totalPremium,
      monthlyPremium,
      coverageLimit,
      policyDuration,
    } = req.body;

    let userId;

    // 1. Check User
    const checkUserSql = `
SELECT id,email,driver_license,nrc
FROM users
WHERE email=?

OR driver_license=?
`;

db.query(
  checkUserSql,
  [email, driverLicense],
  async (err, userResult) => {

    if (err) {
      return res.status(500).json(err);
    }


    if (userResult.length > 0) {

      const existingUser = userResult[0];

        if (existingUser.driver_license === driverLicense && existingUser.email === email) {
              console.log("SAME USER FOUND:", existingUser);
             userId = existingUser.id;
       return saveVehicle(userId);
      }

      if (existingUser.email === email) {
        return res.status(400).json({
          message: "Email already exists."
        });
      }


      if (existingUser.nrc === nrc) {
        return res.status(400).json({
          message: "NRC already exists."
        });
      }


      if (existingUser.driver_license === driverLicense) {
        return res.status(400).json({
          message: "Driver License already exists."
        });
      }

       

    }


    // No duplicate → continue insert user

    const hashPassword = await bcrypt.hash(
      "password123",
      10
    );


    db.query(
      `
      INSERT INTO users
      (
      name,
      phone,
      email,
      nrc,
      address,
      dob,
      driver_license,
      driver_year,
      role,
      password
      )
      VALUES(?,?,?,?,?,?,?,?,?,?)
      `,
      [
        fullName,
        phone,
        email,
        nrc,
        address,
        dob,
        driverLicense,
        drivingYear,
        "user",
        hashPassword
      ],
      (err,result)=>{

        if(err){
          return res.status(500).json(err);
        }

        userId=result.insertId;

        saveRisk(userId);

      }
    );

  }
);
    // 4. Insert Risk
    function saveRisk(userId) {
      db.query(
        `
INSERT INTO risk_assessment
(user_id,risk_level)
VALUES(?,?)
`,
        [userId, "low"],

        (err) => {
          if (err) {
            return res.status(500).json(err);
          }

          saveVehicle(userId);
        },
      );
    }

    // 2. Insert Vehicle
    function saveVehicle(userId) {
      db.query(
        `
SELECT vehicle_id
FROM vehicles
WHERE vehicle_number=?
`,
        [vehicleNumber],

        (err, result) => {
          if (err) return res.status(500).json(err);

          if (result.length > 0) {
            return res.status(400).json({
              message: "Vehicle number already exists.",
            });
          }

          const vehicleSql = `
        INSERT INTO vehicles
        (
          vehicle_number,
          vehicle_model,
          model_year
        )
        VALUES(?,?,?)
      `;

          db.query(
            vehicleSql,
            [vehicleNumber, vehicleModel, modelYear],
            (err, vResult) => {
              if (err) {
                return res.status(500).json(err);
              }

              const vehicleId = vResult.insertId;

              savePolicy(vehicleId,userId);
            },
          );
        },
      );
    }

    // 3. Insert Policy
    async function savePolicy(vehicleId,userId) {
          console.log("savePolicy called");
    const generatedPolicyNumber = await generatePolicyNumber(db);
      /*db.query(
        `
SELECT policy_id
FROM policies
WHERE policy_number=?
`,
        [policyNumber],

        (err, result) => {
          if (err) return res.status(500).json(err);

          if (result.length > 0) {
            return res.status(400).json({
              message: "Policy number already exists.",
            });
          }*/

          const policySql = `
        INSERT INTO policies
        (
          policy_number,
          user_id,
          vehicle_id,
          start_date,
          end_date,
          total_premium,
          remaining_balance,
          total_coverage,
          monthly_premium,
          policy_duration
        )
        VALUES(?,?,?,?,?,?,?,?,?,?)
      `;

          db.query(
            policySql,
            [
              generatedPolicyNumber,
              userId,
              vehicleId,
              startDate,
              endDate,
              totalPremium,         
              coverageLimit,
              coverageLimit,
              monthlyPremium,
              policyDuration,
            ],
            (err, pResult) => {
              if (err) {
                console.error("Policy Insert Error:",err);
                return res.status(500).json(err);
                 
              }

              const policyId = pResult.insertId;

              saveCoverage(policyId);
            } 
          );  
    }

    // 5. Insert Coverage
    function saveCoverage(policyId) {
      if (!coverage || coverage.length === 0) {
        return res.json({
          message: "User and Policy successfully created",
        });
      }

      let count = 0;

      coverage.forEach((cTypeId) => {
        db.query(
          `
          INSERT INTO coverage_policies
          (
            coverage_type_id,
            policy_id
          )
          VALUES(?,?)
          `,
          [cTypeId, policyId],
          (err) => {
            if (err) {
              return res.status(500).json(err);
              console.log(err);
            }

            count++;

            if (count === coverage.length) {
              res.json({
                message: "User and all data saved successfully",
              });
            }
          },
        );
      });
    }
  };
};
