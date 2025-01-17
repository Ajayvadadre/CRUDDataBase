const restify = require("restify");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const { MongoClient } = require("mongodb");
const utils = require("./utils");
const { bulkDatam } = require("./utils");
dotenv.config();
const server = restify.createServer();
const port = process.env.MONGOPORT;
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

//Insert multiData
server.post("/mongo/multiData", async (req, res) => {
  let collection = await main();
  try {
    console.log("Data uploaded successfully");
    let uploadData = await collection.insertMany(bulkDatam);
    console.log(uploadData);
    console.log("Data uploaded successfully");
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
            min_login: { $min: { $toDate: ["$login"] } },
            max_logout: { $max: { $toDate: ["$logout"] } },
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
    res.send("AgriData error");
  }
});

//Data for hourly report 
server.get("/mongo/summarydata", async (req, res) => {
  console.log("summardata called");
  try {
    let collection = await main();
    // const page = req.query.page || 1;
    // const perPage = req.query.perPage || 20;
    // const skip = (page - 1) * perPage;

    const agriData = await collection
      .aggregate(
        [
          {
            $group: {
              _id: {
                hour: { $hour: "$datetime" },
              },
              call_count: { $sum: 1 },
              total_duration: { $sum: "$duration" },
              total_hold: { $sum: "$hold" },
              total_mute: { $sum: "$mute" },
              total_ringing: { $sum: "$ringing" },
              total_transfer: { $sum: "$transfer" },
              total_conference: { $sum: "$conference" },
              unique_calls: { $addToSet: "$referenceUuid" },
            },
          },
          {
            $project: {
              date: "$_id.date",
              hour: "$_id.hour",
              type: "$_id.type",
              campaignName: "$_id.campaign_name",
              processnName: "$_id .process_name",
              call_count: 1,
              total_duration: 1,
              total_hold: 1,
              total_mute: 1,
              total_ringing: 1,
              total_transfer: 1,
              total_conference: 1,
              unique_calls: { $size: "$unique_calls" },
            },
          },
          {
            $sort: {
              date: 1,
              hour: 1,
            },
          },
        ],

        (allowDiskUse = true)
      )
      .toArray();
    // console.log(agriData)
    res.send(agriData);
  } catch (error) {
    console.log("mongo summary error: ");
    console.log(error);
    res.send("AgriData error");
  }
});

//Data for  overall report
server.get("/mongo/alldata", async (req, res) => {
  console.log("summardata called");
  try {
    let collection = await main();

    const agriData = await collection.find({}).limit(15).toArray();
    // console.log(agriData)
    res.send(agriData);
  } catch (error) {
    console.log("mongo summary error: ");
    console.log(error);
    res.send("AgriData error");
  }
});

//Get data from mySQl and insert in mongoDb(not in use)
server.get("/mongo/getsqldata", async (req, res) => {
  const sqlUrl = "http://localhost:3000/mySql/data/mysql_userdata";
  try {
    const mySqlData = await fetch(sqlUrl);
    const data = await mySqlData.json();
    console.log("Data fetch successfully :");
    //Push sql data in mongoDb
    fetch("http://localhost:3001/mongo/multiData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => console.log("data droped"))
      .catch((err) => console.log(err));
    res.send("fetch data successfully");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// server.get("/mongo/summarydata", async (req, res) => {
//   console.log('summardata called');
//   try {
//     let collection = await main();
//     const agriData = await collection.aggregate([
//       {
//         "$group": {
//           "_id": {
//             "hour": { "$hour": "$datetime" },
//             "type": "$type",
//             "campaignName": "$campaignName",
//             "processnName": "$processnName"
//           },
//           "call_count": { "$sum": 1 },
//           "total_duration": { "$sum": "$duration" },
//           "total_hold": { "$sum": "$hold" },
//           "total_mute": { "$sum": "$mute" },
//           "total_ringing": { "$sum": "$ringing" },
//           "total_transfer": { "$sum": "$transfer" },
//           "total_conference": { "$sum": "$conference" },
//           "unique_calls": { "$addToSet": "$reference_uuid" }
//         }
//       },
//       {
//         "$project": {
//           "hour": "$_id.hour",
//           "type": "$_id.type",
//           "campaign_name": "$_id.campaign_name",
//           "process_name": "$_id .process_name",
//           "call_count": 1,
//           "total_duration": 1,
//           "total_hold": 1,
//           "total_mute": 1,
//           "total_ringing": 1,
//           "total_transfer": 1,
//           "total_conference": 1,
//           "unique_calls": { "$size": "$unique_calls" }
//         }
//       },
//       {
//         "$sort": {
//           "hour": 1
//         }
//       }
//     ]).toArray();
//     // console.log(agriData)
//     return res.send(agriData);
//   } catch (error) {
//     console.log(error);
//     res.send("AgriData error");
//   }
// });