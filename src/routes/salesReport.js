const express = require('express');
const router = express.Router();
const pool = require('../models/pool');

router.put('/', async (req, res) => {
    try {
        const { from, to, created_by } = req.body;

        if (!from || !to || !created_by) {
            return res
                .status(400)
                .json({ error: 'Missing from, to, or created_by' });
        }

        const fromDate = from;
        const toDate = to;

        if (toDate < fromDate) {
            return res
                .status(400)
                .json({ error: 'End date must be on/after start date' });
        }

        const toObj = new Date(toDate);
        const endExclusiveObj = new Date(toObj);
        endExclusiveObj.setDate(endExclusiveObj.getDate() + 1);
        const endExclusive = endExclusiveObj.toISOString().slice(0, 10); // YYYY-MM-DD

        const sql = `
            SELECT d.name, COUNT(o.id) AS sales
            FROM drinks d
            LEFT JOIN drink_order o ON o.drink_id = d.drink_id
            LEFT JOIN orders ord     ON ord.id = o.order_id
            WHERE ord.time_created >= $1 AND ord.time_created < $2
            GROUP BY d.name
            ORDER BY sales DESC, d.name;
        `;

        const { rows } = await pool.query(sql, [fromDate, endExclusive]);

        const fmtRange = `(${fromDate} to ${toDate})`;
        let content = '';
        content += `Sales report from ${fromDate} to ${toDate}. `;
        content += 'Drink name, number of sales:\n';

        if (rows.length === 0) {
            content += '(No sales in this window)\n';
        } else {
            for (const row of rows) {
                const name = row.name;
                const sales = row.sales || 0;
                content += `${name}, ${sales}\n`;
            }
        }

        const reportName = `Sales report ${fmtRange}`;

        const insert = `
            INSERT INTO reports(name, created_by, content)
            VALUES ($1, $2, $3)
            RETURNING report_id, name, created_by, content;
        `;

        const result = await pool.query(insert, [reportName, created_by, content]);

        res.status(201).json({
            message: 'Sales report created successfully',
            report: result.rows[0],
        });
    } catch (err) {
        console.error('Error creating sales report:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
