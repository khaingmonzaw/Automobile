// updateUser.js

exports.updateUser = (db) => {
  return async (req, res) => {

    const policyId = req.params.id;   
console.log("POLICY ID:", policyId);
console.log("BODY:", req.body);
    const {
      fullName,
      phone,
      email,
      nrc,
      address,
      dob,
      driverLicense,
      drivingYear,

      vehicleNumber,
      vehicleModel,
      modelYear,

      policyNumber,
      startDate,
      endDate,

      coverage,
      policyDuration,
      totalPremium,
      monthlyPremium,
      coverageLimit
    } = req.body;


    // 1. Get user_id and vehicle_id from policy_id
    db.query(
      `
      SELECT user_id, vehicle_id
      FROM policies
      WHERE policy_id = ?
      `,
      [policyId],
      (err, policyResult) => {

        if(err){
          return res.status(500).json({
            message:"Find policy error",
            error:err
          });
        }


        if(policyResult.length === 0){
          return res.status(404).json({
            message:"Policy not found"
          });
        }


        const userId = policyResult[0].user_id;
        const vehicleId = policyResult[0].vehicle_id;



        // 2. Update User table
        const userSql = `
          UPDATE users SET
          name=?,
          phone=?,
          email=?,
          nrc=?,
          address=?,
          dob=?,
          driver_license=?,
          driver_year=?
          WHERE id=?
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
            userId
          ],
          (err)=>{

            if(err){
              return res.status(500).json({
                message:"Update user error",
                error:err
              });
            }



            // 3. Update Vehicle table
            const vehicleSql = `
              UPDATE vehicles SET
              vehicle_number=?,
              vehicle_model=?,
              model_year=?
              WHERE vehicle_id=?
            `;


            db.query(
              vehicleSql,
              [
                vehicleNumber,
                vehicleModel,
                modelYear,
                vehicleId
              ],
              (err)=>{

                if(err){
                  return res.status(500).json({
                    message:"Update vehicle error",
                    error:err
                  });
                }



                // 4. Update Policy table
                const policySql = `
                  UPDATE policies SET
                  policy_number=?,
                  start_date=?,
                  end_date=? ,
                  total_premium=?,
                  total_coverage=? ,
                  monthly_premium=?, 
                  policy_duration=? 
                  WHERE policy_id=?
                `;


                db.query(
                  policySql,
                  [
                    policyNumber,
                    startDate,
                    endDate,
                    totalPremium,
                    coverageLimit,
                    monthlyPremium,
                    policyDuration,
                    policyId
                  ],
                  (err)=>{

                    if(err){
                      return res.status(500).json({
                        message:"Update policy error",
                        error:err
                      });
                    }



                    // 5. Remove old coverage
                    db.query(
                      `
                      DELETE FROM coverage_policies
                      WHERE policy_id=?
                      `,
                      [policyId],
                      (err)=>{

                        if(err){
                          return res.status(500).json({
                            message:"Delete coverage error",
                            error:err
                          });
                        }



                        // no coverage selected
                        if(!coverage || coverage.length===0){

                          return res.json({
                            message:"User updated successfully"
                          });

                        }



                        // 6. Insert new coverage
                        const coverageSql = `
                          INSERT INTO coverage_policies
                          (coverage_type_id, policy_id)
                          VALUES (?,?)
                        `;


                        let count = 0;


                        coverage.forEach((coverageId)=>{


                          db.query(
                            coverageSql,
                            [
                              coverageId,
                              policyId
                            ],
                            (err)=>{


                              if(err){
                                console.log(err);
                                return;
                              }


                              count++;


                              if(count === coverage.length){

                                res.json({
                                  message:
                                  "User, Vehicle, Policy and Coverage updated successfully"
                                });

                              }


                            }
                          );


                        });


                      }
                    );


                  }
                );


              }
            );


          }
        );


      }
    );


  };
};