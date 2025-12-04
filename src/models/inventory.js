const pool = require('./pool');

async function getInventory() {
    const worker = await pool.connect();

    const res = await worker.query('SELECT * FROM inventory');
    worker.release();

    return res.rows;
}

async function createInventory(item, quantity, price) {
    const worker = await pool.connect();

    await worker.query('INSERT INTO inventory (item, quantity, price) VALUES($1,$2,$3)', [
        item,
        Number(quantity),
        Number(price),
    ]);

    worker.release();
}

async function updateInventory(id, quantity) {
    const worker = await pool.connect();

    await worker.query('UPDATE inventory SET quantity = $1 WHERE id = $2', [
        Number(id),
        Number(quantity),
    ]);

    worker.release();
}

module.exports = {
    getInventory,
    createInventory,
    updateInventory,
};
