const pool = require("./pool");

async function test() {
    const res = await pool.query("SELECT * FROM employee");
    console.log(res);
}

test();
