const restify = require("restify");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const { MongoClient } = require("mongodb");
dotenv.config();
const { SimpleFaker, faker, Randomiser } = require("@faker-js/faker");
let myData = new SimpleFaker();
const {
  randEmail,
  randFullName,
  randPassword,
  randUuid,
  randTimeZone,
  randBetweenDate,
} = require("@ngneat/falso");
const server = restify.createServer();
const port = process.env.PORT;
const url = process.env.URL;
const collectionName = process.env.COLLECTION;
const client = new MongoClient(url);
const dbName = process.env.DBNAME;
server.use(restify.plugins.bodyParser());
//Connection
let collection;
async function main() {
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  return collection;
}
collection = main();
console.log(uuidv4);
server.get("/", (req, res, next) => {
  res.send("Hello world ");
  next();
});

//Multidata creator
let largeData = [];
const insertMultiData = () => {
  let mainData;
  let dataCreator = () => {
    for (let index = 0; index < 500000; index++) {
      mainData = myData.helpers.arrayElement([
        "marketing",
        "sales",
        "insurance",
      ]);

      largeData.push({
        campaign: mainData,
        fullname: randFullName(),
        password: randPassword(),
        login: Date.now(),
        logout: Date.now() + 200000,
      });
    }
  };
  dataCreator();
};
// insertMultiData();

//Insert multiData
server.post("/mongo/multiData", async (req, res) => {
  console.log(largeData);
  try {
    let uploadData = (await collection).insertMany(largeData);
    console.log(uploadData);
    res.send("uploadData");
  } catch (error) {
    res.send(error);
    console.log("create data error : " + error);
  }
});

//Create data
server.post("/mongo/create", async (req, res) => {
  let { username, password } = req.body;
  const newId = uuidv4();
  let collection = await main();
  // console.log(data);
  try {
    let uploadData = await collection.insertOne({
      username,
      password,
      newId,
    });
    console.log(uploadData);
    res.send(uploadData);
  } catch (error) {
    res.send(error);
    console.log("create data error : " + error);
  }
});

//Update data
server.put("/mongo/update/:id", async (req, res) => {
  let id = req.params.id;
  let data = req.body;
  let collection = await main();
  console.log(id, data);
  try {
    let uploadData = await collection.updateOne({ newId: id }, { $set: data });
    // console.log(uploadData);
    res.status(201).send("Data added successfully");
  } catch (error) {
    console.log(error);
    res.status(400).json("This is update error " + error);
  }
});

//Delete data
server.del("/mongo/delete/:id", async (req, res) => {
  let id = req.params.id;
  let collection = await main();
  let uploadData = await collection.deleteOne({ newId: id });
  console.log("successfully deleted user");
  res.send("Deleted user successfully");
});

server.listen(port, () => {
  console.log("listening on: " + port);
  console.log(url);
});

//Get aggrigarte data
server.get("/mongo/getsumdata", async (req, res) => {
  try {
    let collection = await main();
    const agriData = await collection
      .aggregate([
        {
          $group: {
            _id: "$campaign",
            user_count: { $sum: 1 },
            min_login: { $min: {$toDate: ['$login']} },
            max_logout: { $max: {$toDate: ['$logout']} },
          },
        },
        {
          $project: {
            _id: 0,
            campaign: "$_id",
            user_count: 1,
            min_login: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M:%S",
                date: "$min_login",
              },
            },
            max_logout: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M:%S",
                date: "$max_logout",
              },
            },
          },
        },
      ])
      .toArray();
    console.log("Summary report: ");
    agriData.forEach((row) => {
      console.log(`Campaign: ${row.campaign}`);
      console.log(`User Count: ${row.user_count}`);
      console.log(`Min Login: ${row.min_login}`);
      console.log(`Max Logout: ${row.max_logout}`);
      console.log("");
    });
  } catch (error) {
    console.log(error);
    res.send("AgriData error")
  }
});

async function run() {
  try {
    await client.connect();
    const db = client.db("mydatabase");

    // Execute the pipeline
    const result = await db
      .collection("mysqluserdata")
      .aggregate([
        {
          $group: {
            _id: "$campaign",
            user_count: { $sum: 1 },
            min_login: { $min: "$login" },
            max_logout: { $max: "$logout" },
          },
        },
        {
          $project: {
            _id: 0,
            campaign: "$_id",
            user_count: 1,
            min_login: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M:%S",
                date: "$min_login",
              },
            },
            max_logout: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M:%S",
                date: "$max_logout",
              },
            },
          },
        },
      ])
      .toArray();

    // Print the summary report
    console.log("Summary Report:");
    result.forEach((row) => {
      console.log(`Campaign: ${row.campaign}`);
      console.log(`User Count: ${row.user_count}`);
      console.log(`Min Login: ${row.min_login}`);
      console.log(`Max Logout: ${row.max_logout}`);
      console.log("");
    });

    // Close the connection
    client.close();
  } catch (error) {
    console.error(error);
  }
}

// run();
