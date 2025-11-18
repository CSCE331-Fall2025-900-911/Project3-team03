const express = require('express');
const { createOrder } = require('../models/createOrder');

const router = express.Router();

router.post('/', async (req, res) => {
    if (!req.body.employeeId || !req.body.drinksInfo) {
        return res.status(400).send('Invalid Request');
    }

    const { employeeId, drinksInfo } = req.body;

    if (employeeId == null || drinksInfo == null) {
        return res.status(400).send('Invalid Request');
    }

    const { orderId, totalPrice } = await createOrder(employeeId, drinksInfo);

    if (orderId == null || totalPrice == null) {
        return res.status(500).send('Server Error');
    }

    return res.status(201).send(`Order ${orderId} created with a total price of ${totalPrice}!`);
});

module.exports = router;
