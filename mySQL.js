const restify = require("restify");
const mysql = require("mysql");
const { SimpleFaker, faker, Randomiser } = require("@faker-js/faker");
let myData = new SimpleFaker();
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const server = restify.createServer();
const port = process.env.PORT;
server.use(restify.plugins.bodyParser());
const {
  randEmail,
  randFullName,
  randPassword,
  randUuid,
  randTimeZone,
  randBetweenDate,
} = require("@ngneat/falso");
const moment = require("moment");

// MySQL Connection
var connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: "",
  database: process.env.DATABASENAME,
});

//Insert multiple data

const insertMultiData = () => {
  let mainData;
  let largeData = [];
  let dataCreator = () => {
    for (let index = 0; index < 100000; index++) {
      mainData = myData.helpers.arrayElement([
        "marketing",
        "sales",
        "insurance",
      ]);
      const workingHours = Math.floor(Math.random() * (70000000 - 3600000) + 2000000); // Generate random working hours
      largeData.push([
        (campaign = mainData),
        (fullname = randFullName()),
        (password = randPassword()),
        (login = Date.now()),
        (logout =
          Date.now() +  workingHours),
      ]);
    }
  };
  dataCreator();
  //creating chunk data
  let i,
    temparray,
    chunk = 10;
  for (i = 0; i < largeData.length; i += chunk) {
    temparray = largeData.slice(i, i + chunk);
    insertBigData(temparray);
  }
  console.log(temparray);

  let tempData;
  let chunkData = 20;
  for (let i = 0; i < largeData.length; i = i + chunkData) {
    tempData = largeData.slice(i, chunkData);
  }

  function insertBigData(temparray) {
    return new Promise((resolve, reject) => {
      var sqlQuery = `INSERT INTO mysqluserdata(campaign,username,password,login,logout) VALUES ? `;
      var query = connection.query(
        sqlQuery,
        [temparray],
        (sqlError, sqlResult) => {
          if (sqlError) {
            console.log(sqlError);
            return reject(sqlError);
          } else {
            return resolve(sqlResult);
          }
        }
      );
    });
  }
};
// insertMultiData();

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
      (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log("Successfully fetched data", result);
        res.send(result);
        next();
      }
    );
  } catch (error) {
    console.log("get data error" + error);
    res.send(uploadData);
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

//Summerise data
server.get("/mySql/summerisedata", (req, res, next) => {
  let query =
    " SELECT campaign, COUNT(*) AS user_count, AVG(login) AS avg_login, AVG(logout) AS avg_logout FROM mysqluserdata GROUP BY campaign";
  let getSumData = connection.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.send(err);
      next();
    }
    let summaryData = [];
    result.forEach((element) => {
      summaryData.push({
        campaign: element.campaign,
        user_count: element.user_count, 
        avg_login: moment(element.avg_login).format("LTS"),
        avg_logout: moment(element.avg_logout).format("LTS"),
        workinghour: (
         (element.avg_logout - element.avg_login) / 60 / 60 / 1000)
        + 'hrs',
      });
    });
    console.log(summaryData);
    res.send(summaryData);
    next();
  });
});

//server listen
server.listen(port, () => {
  console.log("listening on: " + port);
});
