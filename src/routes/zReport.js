const express = require('express');
const router = express.Router();
const pool = require('../models/pool');

router.get('/', async (req, res) => {

    const query = `
      SELECT 
          i.item,
          COUNT(dr.id) AS sold_count,
          SUM(dr.price) AS total_revenue
      FROM drink_order dr
      JOIN orders o ON o.id = dr.order_id
      JOIN drinks d ON d.drink_id = dr.drink_id
      JOIN inventory i 
        ON LOWER(d.name) LIKE '%' || LOWER(i.item) || '%'
           OR LOWER(d.category) LIKE '%' || LOWER(i.item) || '%'
      WHERE o.time_created BETWEEN $1 AND $2
      GROUP BY i.item
      ORDER BY sold_count DESC;
    // `;
    // const query = `
    //         SELECT
    //             COUNT(*) FILTER (WHERE total_price > 0) AS num_sales,
    //             COALESCE(SUM(total_price) FILTER (WHERE total_price > 0), 0)::numeric(12,2) AS total_sales,
    //             COUNT(*) FILTER (WHERE total_price = 0) AS discards,
    //             STRING_AGG(DISTINCT employee_id::text, ', ') AS employees
    //         FROM orders
    //         LEFT JOIN employee
    //         ON orders.employee_id = employee.id
    //         WHERE orders.time_created::date = CURRENT_DATE;
    // `;
    try {
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Fail to load Z report:', error);
    }
});

module.exports = router;



