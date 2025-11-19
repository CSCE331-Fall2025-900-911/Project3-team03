const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const user = require('./src/routes/user');
const peak = require('./src/routes/peak');
const profit = require('./src/routes/profit');
const sales = require('./src/routes/sales');
const weeklyInventory = require('./src/routes/weeklyInventory');
const xreport = require('./src/routes/xreport');
const inventory = require('./src/routes/inventory');
const employees = require('./src/routes/employees');
const cashierOrder = require('./src/routes/createOrder');
const kioskOrder = require('./src/routes/createKioskOrder');
const login = require('./src/routes/login');
const wiki = require('./src/routes/wiki');
const auth = require('./src/routes/auth');
const callback = require('./src/routes/callback');
const jwtAPI = require('./src/routes/jwt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT || 3000;

const app = express();

app.use(express.static(path.join(process.cwd(), 'src/public')));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src/views'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/user', user);
app.use('/api/peak', peak);
app.use('/api/profit', profit);
app.use('/api/sales', sales);
app.use('/api/wiki', wiki);
app.use('/api/weeklyInventory', weeklyInventory);
app.use('/api/xreport', xreport);
app.use('/api/inventory', inventory);
app.use('/api/employees', employees);
app.use('/api/cashierOrder', cashierOrder);
app.use('/api/kioskOrder', kioskOrder);
app.use('/api/login', login);
app.use('/api/auth/google', auth);
app.use('/api/auth/google/callback', callback);
app.use('/api/jwt', jwtAPI);

app.get('/routes/cart.js', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'src/routes/cart.js'));
});

app.get('/routes/ADHDFocus.js', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'src/routes/ADHDFocus.js'));
});

app.get('/routes/keyboardShortcuts.js', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'src/routes/keyboardShortcuts.js'));
});

app.get('/', (req, res) => {
    res.render('LandingPage', { title: 'Hello from Yifang!!' });
});

app.get('/login', loginNotAllowed, (req, res) => {
    res.render('LoginPage', { title: 'Employee Login' });
});

app.get('/menu', (req, res) => {
    res.render('CustomerPage', { title: 'Yi Fang Tea - Menu' });
});

app.get('/employee', requireLogin, (req, res) => {
    res.render('EmployeePage', { title: 'Employee Page' });
});

app.get('/cashier', requireLogin, (req, res) => {
    res.render('CashierPage', { title: 'Cashier Page' });
});

app.get('/payment', (req, res) => {
    res.render('PaymentPage', { title: 'Payment Page' });
});

app.get('/manager', requireLogin, (req, res) => {
    res.render('ManagerPage', { title: 'Manager Dashboard' });
});

function requireLogin(req, res, next) {
    const token = req.cookies.authToken;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        jwt.decode(token, process.env.JWT_SECRET);
        return next();
    } catch (e) {
        res.clearCookie('authToken');
        return res.redirect('/login');
    }
}

function loginNotAllowed(req, res, next) {
    const token = req.cookies.authToken;

    if (!token) {
        return next();
    }

    try {
        jwt.decode(token, process.env.JWT_SECRET);
        return res.redirect('/employee');
    } catch (e) {
        res.clearCookie('authToken');
        return next();
    }
}

app.listen(SERVER_PORT, () =>
    console.log(`App started on ${SERVER_PORT} | http://localhost:${SERVER_PORT}/`)
);
