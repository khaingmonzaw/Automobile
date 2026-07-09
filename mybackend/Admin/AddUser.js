const bcrypt = require("bcrypt");

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
      policyNumber,
      coverage,
      startDate,
      endDate,
      coverageLimit,
    } = req.body;


    let userId;


    // 1. Check User
    const checkUserSql = `
      SELECT id 
      FROM users
      WHERE email = ?
      OR nrc = ?
      OR driver_license = ?
    `;


    db.query(
      checkUserSql,
      [email, nrc, driverLicense],
      async (err, userResult) => {

        if(err){
          return res.status(500).json(err);
        }


        // User exists
        if(userResult.length > 0){

          userId = userResult[0].id;

          saveVehicle();

        }


        // New user
        else{

          const hashPassword = await bcrypt.hash(
            "password123",
            10
          );


          const userSql = `
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
          `;


          db.query(
            userSql,
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


              userId = result.insertId;


              saveRisk();

            }
          );

        }


      }
    );


   function saveRisk() {

    const checkRiskSql = `
        SELECT id
        FROM risk_assessment
        WHERE user_id = ?
    `;

    db.query(checkRiskSql, [userId], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        // already has risk
        if (result.length > 0) {
            return saveVehicle();
        }

        const riskSql = `
            INSERT INTO risk_assessment
            (
                user_id,
                risk_level
            )
            VALUES (?,?)
        `;

        db.query(
            riskSql,
            [userId, "low"],
            (err) => {

                if (err) {
                    return res.status(500).json(err);
                }

                saveVehicle();
            }
        );

    });

}



    // 2. Insert Vehicle
    function saveVehicle(){


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
        [
          vehicleNumber,
          vehicleModel,
          modelYear
        ],
        (err,vResult)=>{


          if(err){
            return res.status(500).json(err);
          }


          const vehicleId = vResult.insertId;



          savePolicy(vehicleId);


        }
      );

    }



    // 3. Insert Policy
    function savePolicy(vehicleId){


      const policySql = `
        INSERT INTO policies
        (
          policy_number,
          user_id,
          vehicle_id,
          start_date,
          end_date,
          total_premium,
          remaining_balance
        )
        VALUES(?,?,?,?,?,?,?)
      `;


      db.query(
        policySql,
        [
          policyNumber,
          userId,
          vehicleId,
          startDate,
          endDate,
          coverageLimit,
          coverageLimit
        ],
        (err,pResult)=>{


          if(err){
            return res.status(500).json(err);
          }


          const policyId = pResult.insertId;


          saveCoverage(policyId);

        }
      );

    }



    
    // 5. Insert Coverage
    function saveCoverage(policyId){


      if(!coverage || coverage.length === 0){

        return res.json({
          message:"User and Policy successfully created"
        });

      }


      let count = 0;


      coverage.forEach((cTypeId)=>{


        db.query(
          `
          INSERT INTO coverage_policies
          (
            coverage_type_id,
            policy_id
          )
          VALUES(?,?)
          `,
          [
            cTypeId,
            policyId
          ],
          (err)=>{


            if(err){
              return res.status(500).json(err);
            }


            count++;


            if(count === coverage.length){

              res.json({
                message:"User and all data saved successfully"
              });

            }

          }
        );


      });


    }


  };
};