const express = require('express');
const router = express.Router();
const pool = require('../models/pool');

router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT
                COUNT(*) FILTER (WHERE total_price > 0) AS num_sales,
                COALESCE(SUM(total_price) FILTER (WHERE total_price > 0), 0)::numeric(12,2) AS total_sales,
                COUNT(*) FILTER (WHERE total_price = 0) AS discards,
                STRING_AGG(DISTINCT employee_id::text, ', ') AS employees
            FROM orders
            LEFT JOIN employee
            ON orders.employee_id = employee.id
            WHERE orders.time_created::date = CURRENT_DATE;
    `;

        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Fail to load Z report:', error);
        res.status(500).json({ error: 'Failed to load report' });
    }
});

module.exports = router;
