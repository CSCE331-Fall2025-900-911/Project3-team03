// src/routes/managerDrinks.js
const express = require("express");
const router = express.Router();


const pool = require("../models/pool");


// getall
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, size, price, is_available FROM drinks ORDER BY name"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching drinks:", err);
    res.status(500).json({ error: "Failed to fetch drinks" });
  }
});


// add
router.post("/", async (req, res) => {
  try {
    const { name, size, price } = req.body;

    if (!name || !size || !price) {
      return res
        .status(400)
        .json({ error: "Missing required fields: name, size, price" });
    }

    const insert = await pool.query(
      `INSERT INTO drinks (name, size, price, is_available)
       VALUES ($1, $2, $3, true)
       RETURNING id, name, size, price, is_available`,
      [name, size, price]
    );

    res.status(201).json(insert.rows[0]);
  } catch (err) {
    console.error("Error adding drink:", err);
    res.status(500).json({ error: "Failed to add drink" });
  }
});


// delete
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM drinks WHERE id = $1", [id]);

    res.status(204).end();
  } catch (err) {
    console.error("Error deleting drink:", err);
    res.status(500).json({ error: "Failed to delete drink" });
  }
});

module.exports = router;