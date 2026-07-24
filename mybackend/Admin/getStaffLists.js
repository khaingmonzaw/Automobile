//Addstaff

const bcrypt = require("bcrypt");

exports.getStaffLists = (db) => {
  return async (req, res) => {
  const sql=`
  
  select 
id,
name,
phone,
email,
address,
status
from users
where role="staff"
order by id desc

  `;
  db.query(sql,(err,result)=>{
    if(err){
        console.log(err);
        return res.status(500).json(err);
    }

    res.json(result);
  })
};
};

//khaing mon mon zaw