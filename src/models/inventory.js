const pool = require('./pool');

async function getInventory() {
    const worker = await pool.connect();

    const res = await worker.query('SELECT * FROM inventory');
    worker.release();

    return res.rows;
}

async function createItem(item, quantity, price) {
    const worker = await pool.connect();

    await worker.query('INSERT INTO inventory (item, quantity, price) VALUES($1,$2,$3)', [
        item,
        Number(quantity),
        Number(price),
    ]);

    worker.release();
}

async function updateItem(id, quantity) {
    const worker = await pool.connect();

    await worker.query('UPDATE inventory SET quantity = $1 WHERE id = $2', [
        Number(id),
        Number(quantity),
    ]);

    worker.release();
}

async function deleteItem(id) {
    const worker = await pool.connect();

    await worker.query('DELETE FROM inventory WHERE id = $1', [Number(id)]);

    worker.release();
}

module.exports = {
    getInventory,
    createItem,
    updateItem,
    deleteItem,
};
