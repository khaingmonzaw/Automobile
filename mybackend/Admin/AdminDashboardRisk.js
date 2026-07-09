const bcrypt = require("bcrypt");

exports.adminRisks = (db) => {
  return async (req, res) => {
    const sql = `
    SELECT 
      risk_level, 
      COUNT(*) AS count
    FROM risk_assessment
    WHERE risk_level IS NOT NULL
    GROUP BY risk_level
  `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Risk Stats API Error:", err);
        return res.status(500).json({
          message: "Database Error",
        });
      }

      const stats = {
        low: 0,
        medium: 0,
        high: 0,
      };

      results.forEach((row) => {
        const level = row.risk_level.toLowerCase().trim();

        if (stats.hasOwnProperty(level)) {
          stats[level] = Number(row.count);
        }
      });

      res.json(stats);
    });
  };
};

//Myint <yat Thu
