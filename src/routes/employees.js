const express = require('express');
const router = express.Router();
const pool = require('../models/pool');

router.post('/', async (req, res) => {
    try {
        let { name, permissions, gender, email } = req.body;
        if (!name || !permissions || !gender || !email) {
            return res.status(400).json({ error: 'Missing name, permissions, gender, or email' });
        }

        permissions = permissions.split(',');

        const query = `
      INSERT INTO employee (employee_name, permissions, gender, email)
      VALUES ($1, $2, $3, $4)
      RETURNING id, employee_name, permissions, gender, email;
    `;
        const result = await pool.query(query, [name, permissions, gender, email]);

        res.status(201).json({
            message: 'Employee created successfully',
            employee: result.rows[0],
        });
    } catch (err) {
        console.error('Error creating employee:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, employee_name, permissions, gender, email FROM employee ORDER BY id;'
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let { name, permissions, gender, email } = req.body;

        if (!name || !permissions || !gender || !email) {
            return res.status(400).json({ error: 'Missing name, permissions, gender, or email' });
        }

        permissions = permissions.split(',');

        const result = await pool.query(
            `
      UPDATE employee
      SET employee_name = $1,
          permissions = $2,
          gender = $3,
          email = $4
      WHERE id = $5
      RETURNING id, employee_name, permissions, gender, email;
      `,
            [name, permissions, gender, email, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({
            message: 'Employee updated successfully',
            employee: result.rows[0],
        });
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM employee WHERE id = $1;', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching employee:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
