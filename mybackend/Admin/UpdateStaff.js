exports.updateStaff = (db) => {
  return (req, res) => {
    const id = req.params.id;

    const {
      fullName,
      email,
      phone,
      dob,
      nrcState,
      nrcTownship,
      nrcType,
      nrcNumber,
      address,
    } = req.body;

    // Check duplicate email (excluding current staff)
    db.query(
      "SELECT id FROM users WHERE email = ? AND id <> ?",
      [email, id],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Database Error" });
        }

        if (result.length > 0) {
          return res.status(400).json({
            message: "Email already exists",
          });
        }

        const sql = `
          UPDATE users
          SET
            name = ?,
            email = ?,
            phone = ?,
            dob = ?,
            nrc = ?,
            address = ?
          WHERE id = ?
        `;

        db.query(
          sql,
          [
            fullName,
            email,
            phone,
            dob,
            `${nrcState}/${nrcTownship}(${nrcType})${nrcNumber}`,
            address,
            id,
          ],
          (err) => {
            if (err) {
              return res.status(500).json({
                message: "Database Error",
              });
            }

            res.json({
              message: "Staff updated successfully",
            });
          }
        );
      }
    );
  };
};