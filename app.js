const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const user = require("./src/routes/user");
const peak = require("./src/routes/peak");
const profit = require("./src/routes/profit");
const sales = require("./src/routes/sales");
const weeklyInventory = require("./src/routes/weeklyInventory");
const xreport = require("./src/routes/xreport");
const inventory = require("./src/routes/inventory");
const employees = require("./src/routes/employees");

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src/views"));
app.use(express.static(path.join(process.cwd(), "src/public")));
app.use(express.json());

app.use("/api/user", user);
app.use("/api/peak", peak);
app.use("/api/profit", profit);
app.use("/api/sales", sales);
app.use("/api/weeklyInventory", weeklyInventory);
app.use("/api/xreport", xreport);
app.use("/api/inventory", inventory);
app.use("/api/employees", employees);

app.get("/", (req, res) => {
    res.render("LandingPage", { title: "Hello from Yifang!" });
});

app.get("/login", (req, res) => {
    res.render("LoginPage", { title: "Employee Login" });
});

app.get("/menu", (req, res) => {
    res.render("MenuPage", { title: "Yi Fang Tea - Menu" });
});

app.get("/employee", (req, res) => {
    res.render("EmployeePage", { title: "Employee Page" });
});

app.get("/cashier", (req, res) => {
    res.render("CashierPage", { title: "Cashier Page" });
});

app.listen(SERVER_PORT, () =>
    console.log(
        `App started on ${SERVER_PORT} | http://localhost:${SERVER_PORT}/`
    )
);
