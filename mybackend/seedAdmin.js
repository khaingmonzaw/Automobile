const bcrypt = require("bcrypt");

module.exports = function seedAdmin(db) {
  const name = "Admin";
  const email = "admin@mail.com";
  const password = "admin123";
  const role = "admin";
  db.query(
    `select * from users where email=?`,
    [email],
    async (err, results) => {
      if (err) {
        console.log(err);
        return;
      }

      if (results.length > 0) {
        // console.log("Admin is exists");
        return;
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const sql = `
            
            insert into users (name,email,password,role)
            values(?,?,?,?)
            `;

      db.query(sql, [name, email, hashPassword, role], (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        // console.log("Admin user created successfully");
      });
    },
  );
};
