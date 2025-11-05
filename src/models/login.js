const pool = require('./pool');

async function employeeExists(employeeId) {
    const worker = await pool.connect();

    const res = await worker.query('SELECT * FROM employee WHERE id = %1', [
        employeeId,
    ]);

    return res.rows.length > 0;
}

module.exports = { employeeExists };
