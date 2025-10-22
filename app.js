const express = require("express");
const dotenv = require("dotenv");
const user = require("./src/routes/user");

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT;

const app = express();

app.use("/user", user);

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(SERVER_PORT, () =>
    console.log(
        `App started on ${SERVER_PORT} | http://localhost:${SERVER_PORT}/`
    )
);
