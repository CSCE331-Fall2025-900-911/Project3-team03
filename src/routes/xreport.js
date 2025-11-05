const express = require('express');
const router = express.Router();
const pool = require('../models/pool');

router.put('/', async (req, res) => {
    try {
        const { date, created_by, content } = req.body;

        if (!date || !created_by || !content) {
            return res
                .status(400)
                .json({ error: 'Missing date, created_by, or content' });
        }

        const query = `
      INSERT INTO reports (name, created_by, content)
      VALUES ($1, $2, $3)
      RETURNING id, name, created_at;
    `;

        const result = await pool.query(query, [
            `X-Report ${date}`,
            created_by,
            content,
        ]);

        res.status(201).json({
            message: 'X-Report created successfully',
            report: result.rows[0],
        });
    } catch (error) {
        console.error('Error creating X-Report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
