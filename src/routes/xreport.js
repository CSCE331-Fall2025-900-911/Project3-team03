// src/routes/xreport.js
const express = require('express');
const router = express.Router();
const pool = require('../models/pool');

router.put('/', async (req, res) => {
    try {
        const { date, created_by } = req.body;

        if (!date || !created_by) {
            return res.status(400).json({ error: 'Missing date or created_by' });
        }

        const xReportDate = date;

        const sql = `
            SELECT
                EXTRACT(HOUR FROM o.time_created) + 1 AS hour,
                COUNT(*) FILTER (WHERE o.total_price > 0) AS num_sales,
                COALESCE(SUM(o.total_price) FILTER (WHERE o.total_price > 0), 0)::numeric(12,2) AS total_sales,
                COUNT(*) FILTER (WHERE o.total_price = 0) AS discards,
                STRING_AGG(DISTINCT e.employee_name, ', ') AS employees
            FROM orders o
            LEFT JOIN employee e ON e.id = o.employee_id
            WHERE o.time_created::date = $1
            GROUP BY hour
            ORDER BY hour;
        `;

        const { rows } = await pool.query(sql, [xReportDate]);

        let body = '';
        body += `X-Report for ${xReportDate}\n`;
        body += 'Hour                 | Sales | Total($) | Discards | Employees\n';
        body += '--------------------------------------------------------------\n';

        if (rows.length === 0) {
            body += '(No orders for this date)\n';
        } else {
            for (const row of rows) {
                const hour = row.hour;
                const sales = row.num_sales || 0;
                const total = Number(row.total_sales || 0).toFixed(2);
                const discards = row.discards || 0;
                const employees = row.employees || '';

                body += `Hour ${String(hour).padStart(2, ' ')} | ${String(sales).padStart(
                    3,
                    ' '
                )} sales | $${String(total).padStart(7, ' ')} | ${String(discards).padStart(
                    2,
                    ' '
                )} discards | ${employees}\n`;
            }
        }

        const insert = `
            INSERT INTO reports (name, created_by, content)
            VALUES ($1, $2, $3)
            RETURNING report_id, name, created_by, content;
        `;
        const reportName = `X-Report ${xReportDate}`;

        const result = await pool.query(insert, [reportName, created_by, body]);

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
