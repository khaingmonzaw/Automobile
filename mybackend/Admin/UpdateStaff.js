exports.updateStaff = (db)=>{
 return (req,res)=>{

 const id=req.params.id;

 const {
   fullName,
   email,
   phone,
   dob,
   nrcState,
   nrcTownship,
   nrcType,
   nrcNumber,
   address
 }=req.body;


 const sql=`
 UPDATE users SET
 name=?,
 email=?,
 phone=?,
 dob=?,
 nrc=?,
 address=?
 WHERE id=?
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
  id
 ],
 (err,result)=>{

 if(err){
   return res.status(500).json(err);
 }

 res.json({
   message:"Staff updated successfully"
 });

 });

 };
};