// src/routes/managerDrinks.js
const express = require("express");
const router = express.Router();
const pool = require("../models/pool");

/**
 * We map DB columns -> frontend fields as:
 *   drink_id        -> id
 *   name            -> name
 *   category        -> size   (we treat "category" as the size text)
 *   price           -> price
 *   disabled ([])   -> is_available = true if array is empty
 */

// ==================== GET ALL DRINKS ====================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        drink_id AS id,
        name,
        category AS size,
        price,
        (cardinality(disabled) = 0) AS is_available
      FROM drinks
      ORDER BY name
      `
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching drinks:", err);
    res.status(500).json({ error: "Failed to fetch drinks" });
  }
});

// ==================== ADD NEW DRINK ====================
router.post("/", async (req, res) => {
  try {
    const { name, size, price } = req.body;

    if (!name || !size || !price) {
      return res
        .status(400)
        .json({ error: "Missing required fields: name, size, price" });
    }

    // We store:
    //  - name as name
    //  - price as price (double precision)
    //  - size in the "category" column
    //  - ingredients as empty array ([])
    //  - disabled as empty array ([]) => available
    const numericPrice = parseFloat(price);

    const insert = await pool.query(
      `
      INSERT INTO drinks (name, price, ingredients, category, disabled)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        drink_id AS id,
        name,
        category AS size,
        price,
        (cardinality(disabled) = 0) AS is_available
      `,
      [name, numericPrice, [], size, []]
    );

    res.status(201).json(insert.rows[0]);
  } catch (err) {
    console.error("Error adding drink:", err);
    res.status(500).json({ error: "Failed to add drink" });
  }
});

// ==================== DELETE DRINK ====================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Table uses drink_id as primary key
    await pool.query("DELETE FROM drinks WHERE drink_id = $1", [id]);

    res.status(204).end();
  } catch (err) {
    console.error("Error deleting drink:", err);
    res.status(500).json({ error: "Failed to delete drink" });
  }
});

module.exports = router;