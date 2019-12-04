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

// get saved tasks when page loads
app.get("/", function (req, res) {
    connection.query("SELECT * FROM todos", function (err, data) {

        if (err) return res.status(500).end();
        let todosNotDone = [];
        let todosDone = [];
        for (i = 0; i < data.length; i++) {
            if (data[i].done === 0) {
                todosNotDone.push(data[i]);
            }
            else if (data[i].done === 1) {
                todosDone.push(data[i]);
            }
        }
        res.render("index", { todosIncomplete: todosNotDone, todosComplete: todosDone });
    });
});

// route to determine completeness of tasks that will
// allow front-end to determine which header is needed
app.get("/api/headers", function (req, res) {
    connection.query("SELECT * FROM todos", function (err, data) {
        if (err) return res.status(500).end();

        let complete = data.filter((task) => {
            return task.done === 1
        })
        let incomplete = data.filter((task) => {
            return task.done === 0
        })

        res.json({ complete, incomplete })

    });
});


// post tasks to server when Submit button is clicked
app.post("/api/tasks", function (req, res) {
    console.log(req.body);
    connection.query("INSERT INTO todos (task, done) VALUES (?, false)", [req.body.todo], function (err, result) {
        if (err) return res.status(500).end();
        res.json({ id: result.indertId });
        console.log({ id: result.insertId });
    });
});


// get saved tasks and display on /api/tasks page
app.get("/api/tasks", function (req, res) {
    connection.query("SELECT * FROM todos", function (err, data) {
        if (err) return res.status(500).end();
        res.json(data);
    })
})


app.put("/api/tasks/:id", function (req, res) {
    // check whether if it's todo or task
    console.log(req.body);
    connection.query("UPDATE todos SET done=true WHERE id=?", [req.params.id], function (err, response) {
        if (err) throw err;
        if (err) return res.status(500).end();
        if (response.changedRows === 0) {
            return res.status(404).end();
        }
        res.status(200).end();
    })
})

// listen to the port
app.listen(PORT, function () {
    console.log("App listening on http://localhost:" + PORT);
})