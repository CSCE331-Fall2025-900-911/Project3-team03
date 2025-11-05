const express = require('express');
const router = express.Router();
const pool = require('../models/pool');

router.get('/', async (req, res) => {
    try {
        const query = `
        SELECT 
            drink_id,
            SUM(price)/52 as revenue,
            COUNT(*) as total_order
        FROM drink_order
        GROUP BY drink_id
        ORDER BY revenue DESC;
        `;

        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching profit data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
