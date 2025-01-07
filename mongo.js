const restify = require("restify");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const { MongoClient } = require("mongodb");
dotenv.config();
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
  res.send('Deleted user successfully')
});

server.listen(port, () => {
  console.log("listening on: " + port);
  console.log(url);
});
