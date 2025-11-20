const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const router = express.Router();

router.get('/', async (req, res) => {
    const redirectURL =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${process.env.CLIENT_ID}&` +
        `redirect_uri=${process.env.ENV === 'DEV' ? process.env.DEV_URI : process.env.PROD_URI}&` +
        `response_type=code&` +
        `scope=openid%20email%20profile&` +
        `access_type=offline&` +
        `prompt=select_account`;

    return res.redirect(301, redirectURL);
});

module.exports = router;
