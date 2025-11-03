const express = require("express");
const router = express.Router();
const pool = require("../models/pool");

router.get("/:weekNumber", async (req, res) => {
  try {
    const { weekNumber } = req.params;
    if (!weekNumber) {
      return res.status(400).json({ error: "Missing week number" });
    }

    const year = new Date().getFullYear();

    const jan1 = new Date(year, 0, 1);
    const daysOffset = (parseInt(weekNumber) - 1) * 7;
    const startDate = new Date(jan1.getTime() + daysOffset * 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);

    const formatDate = (d) => d.toISOString().split("T")[0];
    const startStr = formatDate(startDate);
    const endStr = formatDate(endDate);

    console.log(`Week ${weekNumber}: ${startStr} → ${endStr}`);

    const query = `
      SELECT 
          i.item,
          COUNT(dr.id) AS sold_count,
          SUM(dr.price) AS total_revenue
      FROM drink_order dr
      JOIN orders o ON o.id = dr.order_id
      JOIN drinks d ON d.drink_id = dr.drink_id
      JOIN inventory i 
        ON LOWER(d.name) LIKE '%' || LOWER(i.item) || '%'
           OR LOWER(d.category) LIKE '%' || LOWER(i.item) || '%'
      WHERE o.time_created BETWEEN $1 AND $2
      GROUP BY i.item
      ORDER BY sold_count DESC;
    `;

    const result = await pool.query(query, [startStr, endStr]);
    res.status(200).json(result.rows);

  } catch (error) {
    console.error("Error fetching weekly inventory data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
