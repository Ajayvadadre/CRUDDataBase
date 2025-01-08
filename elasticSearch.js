const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://192.168.0.128:9200/" });
const restify = require("restify");
const {
  randEmail,
  randFullName,
  randPassword,
  randUuid,
  randTimeZone,
} = require("@ngneat/falso");

const dotenv = require("dotenv");
// const faker = require("faker-js");
dotenv.config();
const server = restify.createServer();
const port = process.env.PORT;
server.use(restify.plugins.bodyParser());

server.listen(port, () => {
  console.log("listening on: " + port);
});

// const createIndex = async (indexName) => {
//   await client.indices.create({ index: indexName });
//   console.log("Index created");
// };

// createIndex("ajay");

server.post("/bulkdata", async (req, res) => {
  const bulkData = [];
  for (let index = 0; index < 40; index++) {
    const body = {
      email: randEmail(),
      name: randFullName(),
      password: randPassword(),
      Id: randUuid(),
      Time: randTimeZone()
    };
    bulkData.push({ index: { _index: "ajay", _id: index } });
    console.log(bulkData);
    bulkData.push(body);
  }
  try {
    const response = await client.bulk({ body: bulkData });
    // console.log(response);
    res.send("Bulk data created successfully");
  } catch (error) {
    console.log("Bulk data create error : " + error);
    res.send("Bulk data create error : " + error);
  }
});

// // Get data
server.get("/elasticsearch/get/:indexName", async (req, res) => {
  const indexName = req.params.indexName;
  //   const id = req.params.id;
  console.log(indexName);
  try {
    const getData = await client.search({
      index: indexName,
      query: {
        match_all: {},
      },
    });
    console.log("Get data successfull of " + indexName + ", " + getData);
    res.send(getData);
  } catch (error) {
    res.send("Get data error :" + error);
    console.log(error);
  }
});

// Create data
server.post("/elasticsearch/create", async (req, res) => {
  const { indexname, username, password, id } = req.body;

  try {
    let data = await client.index({
      index: indexname,
      id: id,
      document: req.body,
    });
    res.send("Data created successfully : " + data);
    console.log("Data created of : " + data);
  } catch (error) {
    console.log("Data create error : " + error);
    res.send("Data create error : " + error);
  }
});

//Update data
server.put("/elasticsearch/update/:indexname/:id", async (req, res) => {
  const indexname = req.params.indexname;
  const id = req.params.id;
  const { username, password } = req.body;
  try {
    const updateData = await client.update({
      index: indexname,
      id: id,
      doc: req.body,
    });
    console.log("Updated data succesfully: " + updateData);
    res.send("Update data successfully: " + updateData);
  } catch (error) {
    console.log("Update error : " + error);
    res.send("Update error: " + error);
  }
});

// Delete data
server.del("/elasticsearch/delete/:indexname/:id", async (req, res) => {
  const indexname = req.params.indexname;
  const id = req.params.id;
  try {
    const deleteData = await client.delete({
      index: indexname,
      id: id,
    });
    console.log("data deleted successfully : ", deleteData);
    res.send(deleteData);
  } catch (error) {
    res.send("Delete data error: " + error);
    console.log(error);
  }
});
