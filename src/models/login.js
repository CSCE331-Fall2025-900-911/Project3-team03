const pool = require('./pool');

async function employeeExists(employeeEmail) {
    const worker = await pool.connect();

    const res = await worker.query('SELECT id FROM employee WHERE email = $1', [employeeEmail]);

    worker.release();
    return res.rows[0];
}

module.exports = { employeeExists };
