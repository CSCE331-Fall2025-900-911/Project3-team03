const pool = require("./pool");

async function getDrinkInfo(drink_id) {
    const res = await pool.query(
        "SELECT drink_id, price FROM drinks WHERE drink_id = $1",
        [drink_id]
    );
    if (res) {
        return { id: res.rows[0], price: res.rows[1] };
    } else {
        throw new Error(`Drink ${drink_id} not found.`);
    }
}

async function createAttributes(ice, milk, sugar, drink_size, temp) {
    const res = await pool.query(
        "INSERT INTO attributes (ice, milk, sugar, drink_size, temp) VALUES (%1, %2, %3, %4, %5) RETURNING attributes_id",
        [ice, milk, sugar, drink_size, temp]
    );
    return res.rows[0];
}

async function createToppings(
    pearl = False,
    crystal_boba = False,
    aloe = False,
    sago = False,
    lychee_jelly = False,
    alyu_jelly = False,
    grass_jelly = False,
    custard_pudding = False,
    salty_cream = False
) {
    const res = await pool.query(
        "INSERT INTO toppings (pearl, crystal_boba, aloe, sago, lychee_jelly, alyu_jelly, grass_jelly, custard_pudding, salty_cream) VALUES (%1,%2,%3,%4,%5,%6,%7,%8,%9) RETURNING toppings_id",
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
    return res.rows[0];
}

module.exports = {
    getDrinkInfo,
    createToppings,
    createAttributes,
};
