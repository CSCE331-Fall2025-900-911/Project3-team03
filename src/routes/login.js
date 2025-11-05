const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { employeeExists } = require('../models/login');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const router = express.Router();

router.post('/', async (req, res) => {
    const { employeeId, password } = req.body;

    if (employeeId == null || password == null) {
        return res
            .status(400)
            .send({ success: false, message: 'Invalid Request' });
    }

    if (
        !employeeExists(employeeId) ||
        password !== process.env.STORE_PASSWORD
    ) {
        return res
            .status(401)
            .send({ success: false, message: 'Unauthorized' });
    }

    return res.status(200).send({ success: true, message: 'Logged in!' });
});

module.exports = router;
