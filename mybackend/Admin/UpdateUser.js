//Adduser

const bcrypt = require("bcrypt");

exports.updateUser = (db) => {
  return async (req, res) => {
    const userId = req.params.id;
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
    } = req.body;
    // ၁။ User အချက်အလက်များကို Update လုပ်ခြင်း
    const userSql = `UPDATE users SET name=?, phone=?, email=?, nrc=?, address=?, dob=?, driver_license=?, driver_year=? WHERE id=?`;
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
        userId,
      ],
      (err) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Update User Error", error: err });

        // ၂။ User နဲ့ ဆက်စပ်နေတဲ့ Policy နှင့် Vehicle ID များကို ရှာဖွေခြင်း
        db.query(
          "SELECT policy_id, vehicle_id FROM policies WHERE user_id = ?",
          [userId],
          (err, pResult) => {
            if (err || pResult.length === 0)
              return res.status(500).json({ message: "Policy not found" });
            const { policy_id, vehicle_id } = pResult[0];

            // ၃။ Vehicle Update လုပ်ခြင်း
            const vehicleSql =
              "UPDATE vehicles SET vehicle_number=?, vehicle_model=?, model_year=? WHERE vehicle_id=?";
            db.query(
              vehicleSql,
              [vehicleNumber, vehicleModel, modelYear, vehicle_id],
              (err) => {
                if (err)
                  return res
                    .status(500)
                    .json({ message: "Update Vehicle Error", error: err });

                // ၄။ Policy Update လုပ်ခြင်း
                const policySql =
                  "UPDATE policies SET policy_number=?, start_date=?, end_date=? WHERE policy_id=?";
                db.query(
                  policySql,
                  [policyNumber, startDate, endDate, policy_id],
                  (err) => {
                    if (err)
                      return res
                        .status(500)
                        .json({ message: "Update Policy Error", error: err });

                    // ၅။ Coverage Policies ကို အရင် Delete လုပ်ပြီး အသစ်ပြန်ထည့်ခြင်း (အလွယ်ဆုံးနည်းလမ်း)
                    db.query(
                      "DELETE FROM coverage_policies WHERE policy_id = ?",
                      [policy_id],
                      (err) => {
                        if (err)
                          return res
                            .status(500)
                            .json({
                              message: "Coverage Cleanup Error",
                              error: err,
                            });

                        if (!coverage || coverage.length === 0) {
                          return res.json({
                            message: "User data updated successfully!",
                          });
                        }

                        // Coverage အသစ်များ ထည့်ခြင်း
                        const coverageSql =
                          "INSERT INTO coverage_policies (coverage_type_id, policy_id) VALUES (?, ?)";
                        let count = 0;
                        coverage.forEach((cTypeId) => {
                          db.query(coverageSql, [cTypeId, policy_id], () => {
                            count++;
                            if (count === coverage.length) {
                              res.json({
                                message:
                                  "User data and coverage updated successfully!",
                              });
                            }
                          });
                        });
                      },
                    );
                  },
                );
              },
            );
          },
        );
      },
    );
  };
};

//Khaing Mon Mon Zaw
