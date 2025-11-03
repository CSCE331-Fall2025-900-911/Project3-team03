const pool = require("./pool");
const {
    getDrinkInfo,
    createAttributes,
    createToppings,
} = require("./orderFetch");

async function createOrder(drinksInfo) {
    let totalPrice = 0;
    const res = await pool.query(
        "INSERT INTO kiosk_order (total_price) VALUES (%1) RETURNING id",
        [0]
    );
    orderId = res.rows[0];

    for (const drink in drinksInfo) {
        const { id: drinkId, price: drinkPrice } = getDrinkInfo(drink.id);
        const attributeId = createAttributes(
            drink.ice ?? 0,
            drink.milk ?? "",
            drink.sugar ?? 0,
            drink.size ?? "",
            drink.temp ?? ""
        );
        const toppingId = createToppings({ ...(d.toppings ?? {}) });
    }
}
