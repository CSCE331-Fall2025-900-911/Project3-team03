const express = require('express');
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
const fs = require('fs');

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT || 3000;

const app = express();

app.use('/js', express.static(path.join(process.cwd(), 'src/client/js')));
app.use(express.static(path.join(process.cwd(), 'src/public')));

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src/views'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/user', user);
app.use('/api/peak', peak);
app.use('/api/profit', profit);
app.use('/api/sales', sales);
app.use('/api/weeklyInventory', weeklyInventory);
app.use('/api/xreport', xreport);
app.use('/api/inventory', inventory);
app.use('/api/employees', employees);
app.use('/api/cashierOrder', cashierOrder);
app.use('/api/kioskOrder', kioskOrder);
app.use('/api/login', login);

app.get('/routes/cart.js', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'src/routes/cart.js'));
});

app.get('/', (req, res) => {
    res.render('LandingPage', { title: 'Hello from Yifang!!' });
});

app.get('/login', (req, res) => {
    res.render('LoginPage', { title: 'Employee Login' });
});

app.get('/menu', (req, res) => {
    res.render('CustomerPage', { title: 'Yi Fang Tea - Menu' });
});

app.get('/employee', (req, res) => {
    res.render('EmployeePage', { title: 'Employee Page' });
});

app.get('/cashier', (req, res) => {
    res.render('CashierPage', { title: 'Cashier Page' });
});

app.get('/payment', (req, res) => {
    res.render('PaymentPage', { title: 'Payment Page' });
});

app.listen(SERVER_PORT, () =>
    console.log(`App started on ${SERVER_PORT} | http://localhost:${SERVER_PORT}/`)
);

app.get('/manager', (req, res) => {
    res.render('ManagerPage', { title: 'Manager Dashboard' });
});
