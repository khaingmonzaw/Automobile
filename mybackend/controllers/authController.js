const bcrypt=require ("bcrypt");
exports.login=(db)=>{


return async(req,res)=>{

     const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email],async (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database Error" });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "*Invalid credentials",
      });
    }

    const user = results[0];


    // Password incorrect

const isMatch=await bcrypt.compare(password,user.password)
    if (!isMatch) {
      return res.status(401).json({
        message: "*Invalid credentials",
      });
    }

    if (results.length > 0) {
      res.json({
        message: "Login Successful",
        token: "login-token",
         user:{
                        id:user.id,
                        name:user.name,
                        email:user.email,
                        role:user.role,
                        status:user.status
                    }
      });
    }
  });
}

}

