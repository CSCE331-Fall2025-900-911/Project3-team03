const pool = require('./pool');
const { parseDrinkOrder } = require('./orderFetch');

async function createKioskOrder(drinksInfo, rewardApplied, phoneNumber) {
    const worker = await pool.connect();

    let totalPrice = 0;
    const res = await worker.query(
        'INSERT INTO kiosk_order (total_price) VALUES ($1) RETURNING id',
        [Number(0)]
    );
    const orderId = res.rows[0].id;

    for (const drink of drinksInfo) {
        let { drinkId, attributeId, toppingId, drinkPrice } = await parseDrinkOrder(worker, drink);

        await worker.query(
            'INSERT INTO kiosk_drink_order (order_id, drink_id, attributes_id, toppings_id, price) VALUES ($1,$2,$3,$4,$5)',
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
    if (rewardApplied) {
        totalPrice = Math.max(totalPrice - 5, 0);
    }

    const phone = phoneNumber ? String(phoneNumber).trim() : null;
    if (phone) {
        await worker.query(
            `INSERT INTO rewards (phone_number, order_count)
            VALUES ($1, 0)
            ON CONFLICT (phone_number)
            DO NOTHING`,
            [phone]
        );

        await worker.query(
            `UPDATE rewards SET order_count = order_count + 1 WHERE phone_number = $1`,
            [phone]
        );
    }

    await worker.query('UPDATE kiosk_order SET total_price = $1 WHERE id = $2', [
        Number(totalPrice),
        Number(orderId),
    ]);

    console.log(`Order ${orderId} created with total price ${totalPrice}`);
    (await worker).release();
    return { orderId, totalPrice };
}

module.exports = {
    createKioskOrder,
};
