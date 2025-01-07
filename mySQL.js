const restify = require("restify");
const mysql = require("mysql");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const server = restify.createServer();
const port = process.env.PORT;
server.use(restify.plugins.bodyParser());

// MySQL Connection
var connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: "",
  database: process.env.DATABASENAME,
});

//  DB connection
connection.connect(() => {
  try {
    console.log("Sql connected");
  } catch (error) {
    console.log(error);
  }
});

server.get("/", async (req, res) => {
  await res.send("Hello world ");
});

//Get data
server.get("/mySql/data", (req, res, next) => {
  try {
    let uploadData = connection.query(
      "SELECT * FROM  mysqluserdata",
      (err, response) => {
        if (err) {
          console.log(err);
        }
        console.log(response);
        res.send("Successfully fetched data" + response);
        next();
      }
    );
  } catch (error) {
    console.log(error);
    next();
  }
});

//Create data
server.post("/mySql/create", async (req, res) => {
  let { username, password } = req.body;
  console.log(username, password);
  let query = "INSERT INTO  mysqluserdata (username,password) VALUES(?,?)";
  try {
    let uploadData = connection.query(query, [username, password]);
    console.log("data uploaded ");
    res.send("data uploaded of :" + [username, password]);
  } catch (error) {
    res.send(error);
    console.log("create data error : " + error);
  }
});

//Update data
server.put("/mySql/update/:id", async (req, res) => {
  let id = req.params.id;
  let data = req.body;
  console.log(id, data);
  let query = "UPDATE mysqluserdata SET ? WHERE id = ?";
  try {
    connection.query(query, [data, id]);
    console.log("data inserted ");
    res.send("data updated to: " + data);
  } catch (error) {
    res.send("Update error :" + error);
    console.log("update data error : " + error);
  }
});

//Delete data
server.del("/mySql/delete", async (req, res) => {
  let { id } = req.body;
  console.log(id);
  let query = "DELETE FROM  mysqluserdata WHERE id = ?";
  try {
    connection.query(query, [id]);
    console.log("data deleted ");
    res.send("data deleted of :" + id);
  } catch (error) {
    res.send(error);
    console.log("delete data error : " + error);
  }
});

//server listen
server.listen(port, () => {
  console.log("listening on: " + port);
});
