const express = require("express");
const router = express.Router();
const pool = require("../models/pool");

router.get("/", async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: "Missing start or end date" });
    }

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

    const result = await pool.query(query, [start, end]);
    res.status(200).json(result.rows);

  } catch (error) {
    console.error("Error fetching weekly inventory data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
