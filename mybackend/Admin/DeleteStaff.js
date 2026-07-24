exports.updateStaffStatus = (db) => {
 return (req,res)=>{

   const {id} = req.params;
   const {status} = req.body;


   const sql = `
      UPDATE users
      SET status=?
      WHERE id=? AND role='staff'
   `;


   db.query(
     sql,
     [status,id],
     (err,result)=>{

       if(err){
         return res.status(500).json({
           message:"Database Error"
         });
       }


       res.json({
         message:`Staff ${status} successfully`
       });

     }
   );

 };
};