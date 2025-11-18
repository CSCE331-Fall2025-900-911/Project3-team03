const express = require('express');
const { createKioskOrder } = require('../models/createKioskOrder');

const router = express.Router();

router.post('/', async (req, res) => {
    if (!req.body.drinksInfo) {
        return res.status(400).send('Invalid Request');
    }

    const { drinksInfo } = req.body;

    if (drinksInfo == null) {
        return res.status(400).send('Invalid Request');
    }

    const { orderId, totalPrice } = await createKioskOrder(drinksInfo);

    if (orderId == null || totalPrice == null) {
        return res.status(500).send('Server Error');
    }

    return res.status(201).send(`Order ${orderId} created with a total price of ${totalPrice}!`);
});

module.exports = router;
