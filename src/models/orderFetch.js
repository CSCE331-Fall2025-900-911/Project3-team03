async function parseDrinkOrder(worker, drink) {
    let { id: drinkId, price: drinkPrice } = await getDrinkInfo(
        worker,
        drink.drink_id
    );
    const attributeId = await createAttributes(
        worker,
        drink.ice ?? 0,
        drink.milk ?? "",
        drink.sugar ?? 0,
        drink.size ?? "",
        drink.temp ?? ""
    );
    const drinkToppings = drink.toppings ?? {};
    const toppingId = await createToppings(
        worker,
        drinkToppings.pearl,
        drinkToppings.crystal_boba,
        drinkToppings.aloe,
        drinkToppings.sago,
        drinkToppings.lychee_jelly,
        drinkToppings.alyu_jelly,
        drinkToppings.grass_jelly,
        drinkToppings.custard_pudding,
        drinkToppings.salty_cream
    );

    drinkPrice +=
        Object.values(drinkToppings).filter((v) => v === true).length * 0.5;

    return { drinkId, attributeId, toppingId, drinkPrice };
}

async function getDrinkInfo(worker, drinkId) {
    const res = await worker.query(
        "SELECT drink_id, price FROM drinks WHERE drink_id = $1",
        [Number(drinkId)]
    );
    if (res) {
        return { id: res.rows[0].drink_id, price: res.rows[0].price };
    } else {
        throw new Error(`Drink ${drinkId} not found.`);
    }
}

async function createAttributes(worker, ice, milk, sugar, drink_size, temp) {
    const res = await worker.query(
        "INSERT INTO attributes (ice, milk, sugar, drink_size, temp) VALUES ($1, $2, $3, $4, $5) RETURNING attributes_id",
        [ice, milk, sugar, drink_size, temp]
    );
    return res.rows[0].attributes_id;
}

async function createToppings(
    worker,
    pearl = false,
    crystal_boba = false,
    aloe = false,
    sago = false,
    lychee_jelly = false,
    alyu_jelly = false,
    grass_jelly = false,
    custard_pudding = false,
    salty_cream = false
) {
    const res = await worker.query(
        "INSERT INTO toppings (pearl, crystal_boba, aloe, sago, lychee_jelly, alyu_jelly, grass_jelly, custard_pudding, salty_cream) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING toppings_id",
        [
            pearl,
            crystal_boba,
            aloe,
            sago,
            lychee_jelly,
            alyu_jelly,
            grass_jelly,
            custard_pudding,
            salty_cream,
        ]
    );
    return res.rows[0].toppings_id;
}

module.exports = {
    parseDrinkOrder,
};
