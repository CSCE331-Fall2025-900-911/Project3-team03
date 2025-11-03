const express = require("express");
const router = express.Router();
const pool = require("../models/pool");

router.get("/", async (req, res) => {
    const query = `
    SELECT d.drink_id,
        COUNT(o.id) AS sales
    FROM drinks d
    LEFT JOIN drink_order o ON o.drink_id = d.drink_id
    GROUP BY d.drink_id
    ORDER BY d.drink_id
    `;
    try {
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching peak sales day:", error);
        res.status(500).json({ error: "Internal server error" });
    }

})

router.post("/", async (req, res) => {
  try {
    const { start, end, created_by } = req.body;
    if (!start || !end) {
      return res.status(400).json({ error: "Missing start or end date" });
    }

    const query = `
      SELECT d.name, COUNT(o.id) AS sales
      FROM drinks d
      LEFT JOIN drink_order o ON o.drink_id = d.drink_id
      LEFT JOIN orders ord ON ord.id = o.order_id
      WHERE ord.time_created >= $1 AND ord.time_created < $2
      GROUP BY d.name
      ORDER BY sales DESC, d.name;
    `;

    const result = await pool.query(query, [start, end]);

    let content = `Sales report from ${start} to ${end}\nDrink name, number of sales:\n`;
    if (result.rows.length === 0) {
      content += "(No sales in this window)\n";
    } else {
      for (const row of result.rows) {
        content += `${row.name}, ${row.sales}\n`;
      }
    }

    const reportName = `Sales report (${start} to ${end})`;
    const insert = `
      INSERT INTO reports(name, created_by, content)
      VALUES ($1, $2, $3)
      RETURNING id, name, created_at;
    `;
    const insertResult = await pool.query(insert, [reportName, created_by || 0, content]);

    res.status(201).json({
      message: "Sales report generated and saved",
      report: insertResult.rows[0],
    });
  } catch (err) {
    console.error("Error generating sales report:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
