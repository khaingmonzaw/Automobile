const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { exec } = require("child_process"); // Call COBOL
const path = require("path"); // for Path
const bcrypt=require ("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "auto_assurance_db",
});

const seedAdmin=require("./seedAdmin");
const authController = require("./controllers/authController");
const passwordController=require("./ChangePassword")
const adminClaims=require("./Admin/AdminDashboardClaim");
const adminRisks=require("./Admin/AdminDashboardRisk");
const newCoverageRouter = require("./Admin/NewCoverage");
const coverageTypesRouter = require("./Admin/CoverageTypes");
const coverageUpdateRouter = require("./Admin/CoverageUpdate");
const addUser=require("./Admin/AddUser");
const updateUser=require("./Admin/UpdateUser");
const checkPolicy=require("./Admin/checkPolicy");
const checkVehicle=require("./Admin/checkVehicle");
const checkLicense=require("./Admin/checkLicense");
const checkDuplicate=require("./Admin/checkDuplicate");
const claimStatusAction=require("./Admin/ClaimStatusAction");
const userLists=require("./Admin/UserList");
const userDetails=require("./Admin/UserDetail");



const profileUser=require("./User/Profile");
const getPolicy=require("./User/GetPolicy");
const getCoverageByPolicy=require("./User/GetCoverageByPolicy");
const submitClaim=require("./User/SubmitClaim");
const userClaim=require("./User/UserClaim");
const userClaimDetail=require("./User/UserClaimDetail");
const getActiveCoverageType=require("./User/GetActiveCoverageType");
const { get } = require("http");
app.use(newCoverageRouter);
app.use(coverageTypesRouter);
app.use(coverageUpdateRouter);


seedAdmin(db);
// Login API
app.post("/api/login",authController.login(db));

// Change Password API
app.put("/api/change-password",passwordController.changePassword(db));

//Adduser 
app.post("/api/add-user", addUser.addUser(db));
 

//update
app.put('/api/update-user/:id', updateUser.updateUser(db));

// Policy Number တူမတူ စစ်ဆေးရန် API
app.get("/api/check-policy",checkPolicy.checkPolicy(db));
 
// Vehicle Number တူမတူ စစ်ဆေးရန် API
app.get("/api/check-vehicle",checkVehicle.checkVehicle(db));

// License Number တူမတူ စစ်ဆေးရန် API
app.get("/api/check-driverlicense", checkLicense.checkLicense(db));

app.get("/api/check-duplicate", checkDuplicate.checkDuplicate(db));

/* ================= [ထည့်ရမည့်နေရာ] GET ALL CLAIMS FOR ADMIN DASHBOARD ================= */
app.get("/api/admin/claims", adminClaims.adminClaims(db));

app.get("/api/admin/risk-stats",adminRisks.adminRisks(db));

// ✅ NEW: Get all claims from the database
app.get('/api/admin/ClaimStatus/:id',claimStatusAction.claimStatusAction(db));

/* ================= GET USER PROFILE FULL DETAILS ================= */
app.get("/api/user/profile/:userId",profileUser.profile(db));


// Admin all user(userlists)(kmz)
app.get('/api/users',userLists.userLists(db));


// Admin User Detail 
app.get('/api/users/:id',userDetails.userDetails(db));


/* ================= GET POLICIES BY USER ================= */
app.get("/api/policies/:userId",getPolicy.getPolicy(db));

/* ================= GET COVERAGES BY POLICY USER================= */
app.get("/api/coverages/:policyId", getCoverageByPolicy.getCoverageByPolicy(db)
);
// Submit New Claim
app.post("/api/claims",submitClaim.submitClaim(db));

// User Claim API
app.get("/api/claims/user/:userId",userClaim.userClaim(db));


// Claim Details User API
app.get("/api/claims/:id", userClaimDetail.userClaimDetail(db));


//Active Coverage types
app.get("/api/coverage_types",getActiveCoverageType.getActiveCoverageType(db));











// =============================================
// 2. PUT Update Claim Status (Approve/Reject လုပ်ဖို့)
// =============================================
app.put("/api/admin/claims/:id", (req, res) => {

  const claim_id = req.params.id;
  const { status, remark } = req.body;


  // =========================
  // APPROVED PROCESS
  // =========================
  if(status === "APPROVED") {


    // Get all calculation data
    const getClaimSql = `
    SELECT 
    c.claim_id,
    c.claimed_amount,
    c.compensation_amount,
    p.total_premium,
  

    r.risk_level,
    r.risk_percentage
FROM claims c
JOIN policies p 
    ON c.policy_id = p.policy_id
JOIN users u
    ON c.user_id = u.id
JOIN risks r
    ON r.user_id = u.id
WHERE c.claim_id = ?
    `;


    db.query(getClaimSql,[claim_id],(err,result)=>{


      if(err){
        return res.status(500).json({
          message:"Database error",
          error:err
        });
      }


      if(result.length === 0){
        return res.status(404).json({
          message:"Claim not found"
        });
      }



      const claimed_amount = result[0].claimed_amount;
      const total_premium = result[0].total_premium;
      const risk_level = result[0].risk_level;
      const risk_percentage = result[0].risk_percentage;
      const compensation_amount=result[0].compensation_amount;



      console.log(
        claimed_amount,
        total_premium,
        risk_level,
        risk_percentage,
        compensation_amount,
      );



      // =========================
      // CALL COBOL
      // =========================

      const cobolProg = path.join(
        __dirname,
        "calculate.exe"
      );


      const command =
      `"${cobolProg}" "${claimed_amount}" "${total_premium}" "${risk_level}" "${risk_percentage}" "${compensation_amount}"`;



      console.log("COBOL COMMAND:",command);



      exec(command,(error,stdout,stderr)=>{


        if(error){

          console.log("COBOL ERROR:",error);

          return res.status(500).json({
            message:"COBOL calculation failed"
          });

        }



        console.log("COBOL OUTPUT:",stdout);



        /*
          COBOL OUTPUT example:

          COMPENSATION:750000

        */


        // const compensation_amount =
        //   stdout.split(":")[1].trim();



        // =========================
        // SAVE RESULT
        // =========================


        const updateSql = `
          UPDATE claims
          SET
            status=?,
            remark=?,
            compensation_amount=?
          WHERE claim_id=?
        `;


        db.query(
          updateSql,
          [
            "APPROVED",
            remark,
            compensation_amount,
            claim_id
          ],
          (err,result)=>{


            if(err){
              return res.status(500).json({
                message:"Update failed",
                error:err
              });
            }


            res.json({

              message:"Claim approved successfully",

              compensation_amount

            });


          }
        );


      });


    });


  }



  // =========================
  // REJECT PROCESS
  // =========================
  else if(status==="REJECTED"){


    const sql=`
      UPDATE claims
      SET
        status=?,
        remark=?
      WHERE claim_id=?
    `;


    db.query(
      sql,
      [
        "REJECTED",
        remark,
        claim_id
      ],
      (err,result)=>{


        if(err){
          return res.status(500).json({
            message:"Update failed"
          });
        }


        res.json({
          message:"Claim rejected successfully"
        });


      }
    );

  }


});
//myo's code end












app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
