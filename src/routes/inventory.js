const express = require('express');
const router = express.Router();
const pool = require('../models/pool');

router.get('/', async (req, res) => {
    try {
        const query = `
        SELECT
        CASE
            WHEN item IN ('oolong tea','green tea','black tea','fruit tea','milk tea','taro','matcha','coffee') THEN 'Base Drink'
            WHEN item IN ('sugar','ice','soy milk','oat milk') THEN 'Add-in'
            WHEN item IN ('pearl','crystal boba','aloe','sago','lychee jelly','aiyu jelly','almond jelly','grass jelly','custard pudding','salty cream') THEN 'Topping'
            WHEN item IN ('cups','straws','napkins','bags','lids','holders') THEN 'Supplies'
            ELSE 'Other'
        END AS category,
        COUNT(*) AS item_count,
        SUM(quantity) AS total_quantity
        FROM inventory
        GROUP BY category
        `;

        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching peak sales day:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/', async (req, res) => {
    try {
        const { item, quantity } = req.body;
        if (!item || quantity === undefined) {
            return res.status(400).json({ error: 'Missing item or quantity' });
        }

        const updateQuery = `
      UPDATE inventory
      SET quantity = $1
      WHERE LOWER(item) = LOWER($2)
      RETURNING item, quantity;
    `;

        const result = await pool.query(updateQuery, [quantity, item]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({
            message: `Updated ${item} quantity successfully`,
            updated: result.rows[0],
        });
    } catch (error) {
        console.error('Error updating inventory:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
