const restify = require("restify"); 
const mysql = require("mysql2/promise");
const axios = require("axios");
const dotenv = require("dotenv");
const utils = require("./utils");

dotenv.config();
const server = restify.createServer();
const port = process.env.PORT;
server.use(restify.plugins.bodyParser());

// MySQL Connection
var connection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: "",
  database: process.env.DATABASENAME,
  timeout: 30000,
});


//--------- API's-----------
server.get("/", async (req, res) => {
  await res.send("Hello world ");
});

//Get data
server.get("/mySql/data/:tablename", (req, res, next) => {
  const tableName = req.params.tablename;
  try {
    let uploadData = connection.query(
      `SELECT * FROM  ${tableName}`,
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

//Summerise data for Report1
server.get("/mySql/summeriseHrdata", (req, res, next) => {
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
        workinghour:
          (element.avg_logout - element.avg_login) / 60 / 60 / 1000 + "hrs",
      });
    });
    console.log(summaryData);
    res.send(summaryData);
    next();
  });
});

//Summerise data for Report2
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
        workinghour:
          (element.avg_logout - element.avg_login) / 60 / 60 / 1000 + "hrs",
      });
    });
    console.log(summaryData);
    res.send(summaryData);
    next();
  });
});

//Insert Big data
server.post("/mysql/postbigdata", async (req, res) => {
  var sqlQuery = `INSERT INTO  mysql_userdata(datetime	,type	,disposetype,	disposename	,duration,	agentname	,campaignName	,processName	,leadset,	referenceUuid	,customerUuid,	hold	,mute	,ringing,	transfer	,conference	,oncall	,disposetime	) VALUES ? `;
  const insertBigData = await utils.insertMultiHrData();
  try {
    
  } catch (error) {
    
  }
    connection.query(sqlQuery, [insertBigData], (sqlError, sqlResult) => {
      if (sqlError) {
        console.log("push error");
        console.log(sqlError);
        return res.send(sqlError);
      } else {
        console.log(sqlResult);
        return res.send("data Dumped succssfully");
      }
    });
  // });
  // console.log(insertBigData);
});

//server listen
server.listen(port, () => {
  console.log("listening on: " + port);
});


