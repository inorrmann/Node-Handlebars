const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.user,
    password: process.env.pw,
    database: "todolistDB"
});

connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
});

app.get("/", function (req, res) {
    connection.query("SELECT * FROM todos", function (err, data) {
        if (err) return res.status(500).end();
        let todosNotDone = [];
        let todosDone = [];
        for (i = 0; i < data.length; i++) {
            if (data[i].done === 0) {
                todosNotDone.push(data[i]);
            }
            else {
                todosDone.push(data[i]);
            }
        }
        res.render("index", { todosIncomplete: todosNotDone, todosComplete: todosDone });
    });
});

app.post("/api/tasks", function (req, res) {
    console.log(req.body);
    connection.query("INSERT INTO todos (task, done) VALUES (?, false)", [req.body.todo], function (err, result) {
        if (err) return res.status(500).end();
        res.json({ id: result.indertId });
        console.log({ id: result.insertId });
    });
});

app.get("/api/tasks", function(req, res) {
    connection.query("SELECT * FROM todos", function(err, data) {
        if (err) return res.status(500).end();
        res.json(data);
    })
})


app.listen(PORT, function () {
    console.log("App listening on http://localhost:" + PORT);
})