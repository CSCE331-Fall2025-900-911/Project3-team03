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

        const result = await pool.query(query, [phoneNumber]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Phone number not found' });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching profit data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;