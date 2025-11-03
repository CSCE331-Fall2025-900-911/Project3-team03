const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const user = require("./src/routes/user");

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src/views"));
app.use(express.static(path.join(process.cwd(), "src/public")));

app.use("/api", user);

app.get("/", (req, res) => {
    res.render("LandingPage", { title: "Hello from Yifang!" });
});

app.listen(SERVER_PORT, () =>
    console.log(
        `App started on ${SERVER_PORT} | http://localhost:${SERVER_PORT}/`
    )
);
