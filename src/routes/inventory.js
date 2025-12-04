const express = require('express');
const router = express.Router();
const { getInventory, createItem, updateItem, deleteItem } = require('../models/inventory');

router.get('/', async (req, res) => {
    const all_inventory = await getInventory();

    if (all_inventory) {
        res.status(200).json(all_inventory);
    } else {
        res.status(500).send('Error fetching data');
    }
});

router.post('/', async (req, res) => {
    if (!req.body || !req.body.item || !req.body.quantity || !req.body.price) {
        res.status(400).send('Bad request');
    }

    const { item, quantity, price } = req.body;

    if (item == null || quantity == null || price == null) {
        res.status(400).send('Bad request');
    }

    await createItem(item, quantity, price);

    res.status(200).send('Added item!');
});

router.put('/', async (req, res) => {
    if (!req.body || !req.body.id || !req.body.quantity) {
        res.status(400).send('Bad request');
    }

    const { id, quantity } = req.body;

    if (id == null || quantity == null) {
        res.status(400).send('Bad request');
    }

    await updateItem(id, quantity);

    res.status(200).send('Updated item!');
});

router.delete('/', async (req, res) => {
    if (!req.body || !req.body.id) {
        res.status(400).send('Bad request');
    }

    const { id } = req.body;

    if (id == null) {
        res.status(400).send('Bad request');
    }

    await deleteItem(id);

    res.status(200).send('Deleted item!');
});

module.exports = router;
