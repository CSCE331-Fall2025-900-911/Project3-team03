const pool = require('./pool');
const { parseDrinkOrder } = require('./orderFetch');

async function createOrder(employeeId, drinksInfo) {
    const worker = await pool.connect();

    let totalPrice = 0;
    const res = await worker.query(
        'INSERT INTO orders (total_price, employee_id) VALUES ($1,$2) RETURNING id',
        [Number(0), Number(employeeId)]
    );
    const orderId = res.rows[0].id;

    for (const drink of drinksInfo) {
        let { drinkId, attributeId, toppingId, drinkPrice } = await parseDrinkOrder(worker, drink);

        await worker.query(
            'INSERT INTO drink_order (order_id, drink_id, attributes_id, toppings_id, price) VALUES ($1,$2,$3,$4,$5)',
            [
                Number(orderId),
                Number(drinkId),
                Number(attributeId),
                Number(toppingId),
                Number(drinkPrice),
            ]
        );

        totalPrice += drinkPrice;
    }

    await worker.query('UPDATE orders SET total_price = $1 WHERE id = $2', [
        Number(totalPrice),
        Number(orderId),
    ]);

    console.log(`Order ${orderId} created with total price ${totalPrice}`);
    (await worker).release();
    return { orderId, totalPrice };
}

module.exports = {
    createOrder,
};
