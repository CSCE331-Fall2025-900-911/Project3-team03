const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { employeeExists } = require('../models/login');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.query || !req.query.code) {
        return res.status(400).send('Invalid Request');
    }

    const code = req.query.code;

    try {
        const resp = await axios.post('https://oauth2.googleapis.com/token', {
            code: code,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: process.env.ENV === 'DEV' ? process.env.DEV_URI : process.env.PROD_URI,
            grant_type: 'authorization_code',
        });

        const userData = jwt.verify(resp.data.id_token);
        const employeeData = await employeeExists(userData.email);

        if (!employeeData) {
            return res.status(403).send('Forbidden.');
        }

        const JWT = jwt.sign(
            {
                employeeId: employeeData.id,
                email: userData.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: '48h' }
        );

        res.cookie('authToken', JWT, {
            httpOnly: false,
            secure: process.env.ENV === 'PROD',
            sameSite: 'lax',
            maxAge: 48 * 60 * 60 * 1000,
        });

        return res.redirect(301, '/employee');
    } catch (e) {
        return res.status(400).send('Invalid Request');
    }
});

module.exports = router;
