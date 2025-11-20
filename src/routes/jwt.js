const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(400).json();
    }

    const [type, token] = req.headers.authorization.split(' ');
    if (type !== 'Bearer') {
        return res.status(400).send('Invalid jwt');
    }

    try {
        const { employeeId, email } = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({
            employeeId: employeeId,
            email: email,
        });
    } catch (e) {
        return res.status(400).json();
    }
});

module.exports = router;
