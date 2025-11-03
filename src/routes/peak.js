const express = require("express");
const router = express.Router();
const pool = require("../models/pool");

router.get("/", async (req, res) => {
    try {
        const query = 
        `
        SELECT
        DATE(time_created) AS day, 
        COUNT(*) as total_order
        FROM orders
        GROUP BY day
        ORDER BY total_order DESC
        LIMIT 10;

        `;
        const result = await pool.query(query)
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching peak sales day:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

module.exports = router;