const express = require('express');
const router = express.Router();
const pool = require('../models/pool');

// get reports
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT report_id, name, created_by, content
            FROM reports
            ORDER BY report_id DESC;
        `);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching reports:', err);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

// create new report
router.post('/', async (req, res) => {
    const { name, created_by, content } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Report name is required' });
    }

    try {
        const result = await pool.query(
            `
            INSERT INTO reports (name, created_by, content)
            VALUES ($1, $2, $3)
            RETURNING report_id, name, created_by, content;
            `,
            [name, created_by ?? null, content ?? '']
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating report:', err);
        res.status(500).json({ error: 'Failed to create report' });
    }
});

module.exports = router;
