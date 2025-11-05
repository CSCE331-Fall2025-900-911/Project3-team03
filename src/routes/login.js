const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { employeeExists } = require('../models/login');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const router = express.Router();

router.post('/', async (req, res) => {
    const { employeeId, password } = req.body;

    if (employeeId == null || password == null) {
        return res.status(400).send('Invalid Request');
    }

    if (
        !employeeExists(employeeId) ||
        password === process.env.STORE_PASSWORD
    ) {
        return res.send(401).send('Unauthorized');
    }

    return res.send(200).send('Logged in!');
});

module.exports = router;
