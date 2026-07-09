const express = require('express');
const mysql = require('mysql2');
const { exec } = require('child_process');
const path = require('path');

const router = express.Router();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "auto_assurance_db",
});


// Main endpoint to handle status actions
router.put("/api/admin/claims/:id", (req, res) => {
  const coverage_status = "VALID";
  const claim_id = req.params.id;
  const { status, remark } = req.body;

  // ==========================================
  // 1. APPROVED PROCESS FLOW
  // ==========================================
  if (status === "APPROVED") {
    // Fetch all 14 required fields by joining tables
    const getClaimSql = `
          SELECT 
        c.claim_id,
        c.accident_type, 
        c.accident_date, 
        c.claimed_amount, 
        c.description, 
        c.created_at,
        p.policy_number, 
        p.vehicle_id, 
        p.status AS policy_status, 
        p.total_premium, 
        p.remaining_balance as assessed_amt,
        r.risk_level,
        u.id AS user_id,
        u.name, 
        u.dob, 
        u.driver_year,
        v.model_year
      FROM claims c
      JOIN policies p ON c.policy_id = p.policy_id
      JOIN users u ON c.user_id = u.id
      LEFT JOIN vehicles v ON p.vehicle_id = v.vehicle_id
      LEFT JOIN risk_assessment r ON r.user_id = u.id
      WHERE c.claim_id = ?
    `;

    db.query(getClaimSql, [claim_id], (err, results) => {
      if (err || results.length === 0) {
        return res.status(500).json({ message: "Failed to retrieve claim details for COBOL." });
      }

      const row = results[0];
      
      // Map database values safely to variables for Calc.exe arguments
      const claim_amt = row.claimed_amount || 0;
      const total_premium = row.total_premium || 0;
      const assessed_amt = row.assessed_amt || 0;
      const risk_lvl = row.risk_level || "LOW";
      const dob = row.dob ? new Date(row.dob).toISOString().split('T')[0] : "2000-01-01";  
      const driver_year = row.driver_year || 0;
      const model_year = row.model_year || 2020;

      const cobolPath = path.join(__dirname, '../calculate.exe');
      const command = `"${cobolPath}" ${claim_amt} ${total_premium} ${assessed_amt} "${risk_lvl}" "${dob}" ${driver_year} ${model_year}`;

      exec(command, (error, stdout) => {
        if (error) {
          return res.status(500).json({ message: "COBOL Calculation failed", error: error.message });
        }

        // Parse comma-delimited output from Calc.cob
        const output = stdout.trim().split(',');
        if (output.length < 5) {
          return res.status(500).json({ message: "Invalid output format from processing core." });
        }

        const [cobolStatus, cobolRiskLvl, compensationAmt, finalAssessedAmt, remarkMsg] = output;
        const msg = remark + " " + remarkMsg;
        // Return everything back to PendingTest.jsx as requested
        return res.json({
          claim_id: parseInt(row.claim_id) || 0,
          user_id: parseInt(row.user_id) || 0,
          user_name: row.name,
          policy_no: row.policy_number,
          policy_status: row.policy_status,
          coverage_status: coverage_status,
          risk_lvl: cobolRiskLvl,                  
          compensation_amt: parseFloat(compensationAmt),
          assessed_amount: parseFloat(finalAssessedAmt),
          status: cobolStatus, 
          accident_type: row.accident_type,
          accident_date: row.accident_date,
          submitted_date: row.created_at,
          claim_amt: parseFloat(claim_amt) || 0,
          des: row.description,     
          remark_msg: msg,  
        });
      });
    });

  // ==========================================
  // 2. REJECTED PROCESS FLOW
  // ==========================================
  } else if (status === "REJECTED") {
    const rejectSql = `UPDATE claims SET status = ?, remark = ? WHERE claim_id = ?`;

    db.query(rejectSql, ["REJECTED", remark, claim_id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Update failed" });
      }
      return res.json({ message: "Claim rejected successfully", isRejected: true });
    });
  }
});

// 3. Final submission update route triggered from ApprovalDetails.jsx
router.put('/api/resultupdate/:id', (req, res) => {
  const claim_id = req.params.id;
  const { dataBundle, remark, staffId } = req.body;
  if (!dataBundle) {
    return res.status(400).json({ message: "Missing dataBundle object payload." });
  }
  const fulldata = dataBundle;

  const claimsUpdateSql = `
    UPDATE claims 
    SET approved_staff = ?, status = ?, remark = ?, compensation_amount = ? 
    WHERE claim_id = ?
  `;

  db.query(claimsUpdateSql, [staffId, fulldata.status, remark, fulldata.compensation_amt, claim_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Final submission database update failed" });
    }

    const policyUpdateSql = `
    UPDATE policies 
    SET remaining_balance = ?
    WHERE user_id = ?
  `;

    db.query(policyUpdateSql, [fulldata.assessed_amount, fulldata.user_id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Final submission database update failed" });
      }
      
        const riskUpdateSql = `
          UPDATE risk_assessment
          SET risk_level = ?
          WHERE user_id = ?
        `;
        db.query(riskUpdateSql, [fulldata.risk_lvl, fulldata.user_id], (err, result) => {
          if (err) {
            return res.status(500).json({ message: "Final submission database update failed" });
          }
          res.json({ message: "Claim completely processed and approved!" });
        });

    });
    });

});

module.exports = router;