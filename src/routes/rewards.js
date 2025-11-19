const express = require('express');
const router = express.Router();
const pool = require('../models/pool');

router.get('/:phoneNumber', async (req, res) => {
    try {
        const { phoneNumber } = req.params;
        if (!phoneNumber) {
            return res.status(400).json({ error: 'Missing phone number' });
        }
        const query = `
        SELECT order_count
        FROM rewards
        WHERE phone_number = $1;
        `;
        let result = await pool.query(query, [phoneNumber]);
        if (result.rows.length === 0) {
            const insertQuery =  `
            INSERT INTO rewards (phone_number, order_count)
            VALUES ($1, 0)
            RETURNING order_count;
            `
            result = await pool.query(insertQuery, [phoneNumber])
        }
        return res.status(200).json({
            order_count: result.rows[0].order_count
        });
    } catch (error) {
        console.error('Error fetching profit data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;