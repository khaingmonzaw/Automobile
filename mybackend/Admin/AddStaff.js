const bcrypt = require("bcrypt");

exports.addStaff = (db) => {
  return async (req, res) => {
    try {
      const {
        fullName,
        phone,
        email,
        nrcState,
        nrcTownship,
        nrcType,
        nrcNumber,
        address,
        dob,
      } = req.body;

      const nrc = `${nrcState}/${nrcTownship}(${nrcType})${nrcNumber}`;

      // Check if email already exists
      db.query(
        "SELECT id FROM users WHERE email = ?",
        [email],
        async (checkErr, checkResult) => {
          if (checkErr) {
            console.error(checkErr);
            return res.status(500).json({
              message: "Database Error",
            });
          }

          if (checkResult.length > 0) {
            return res.status(400).json({
              message: "Email already exists.",
            });
          }

          // Hash password only if email does not exist
          const hashPassword = await bcrypt.hash("staff1234", 10);

          const sql = `
            INSERT INTO users
            (
              name,
              phone,
              email,
              nrc,
              address,
              dob,
              role,
              password
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;

          db.query(
            sql,
            [
              fullName,
              phone,
              email,
              nrc,
              address,
              dob,
              "staff",
              hashPassword,
            ],
            (err, result) => {
              if (err) {
                console.error(err);
                return res.status(500).json({
                  message: "Failed to add staff.",
                });
              }

              return res.status(201).json({
                message: "Staff added successfully.",
              });
            }
          );
        }
      );
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  };
};