const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://192.168.0.133:9200/" });
const restify = require("restify");
const dotenv = require("dotenv");
const utils = require("./utils");
dotenv.config();
const server = restify.createServer();
const port = process.env.ELASTICPORT;
server.use(restify.plugins.bodyParser());

server.listen(port, () => {
  console.log("listening on: " + port);
});

// const createIndex = async (indexName) => {
//   await client.indices.create({ index: indexName });
//   console.log("Index created");
// };

// createIndex("ajay");

server.post("/elasticsearch/bulkdata", async (req, res) => {
  const insertBigData = await utils.insertMultiHrData();
  console.log(insertBigData);
  try {
    const response = await client.bulk({ body: insertBigData });
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

server.get("/elasticsearch/alldata", async (req, res) => {
  try {
    const getData = await client.search({
      index: "ajay",
      query: {
        match_all: {},
      },
    });
    console.log(getData)
    res.send(getData.hits.hits.map((value) => value._source));
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
server.del("/elasticsearch/delete/:indexname", async (req, res) => {
  const indexname = req.params.indexname;
  console.log(indexname);
  const id = req.params.id;
  try {
    const deleteData = await client.delete({
      index: "ajay",
    });
    console.log("data deleted successfully : ", deleteData);
    res.send(deleteData);
  } catch (error) {
    res.send("Delete data error: " + error);
    console.log(error);
  }
});

//get summary data
// server.get("/elastic/summary", async (req, res) => {
//   try {
//     const result = await Eclient.search({
//       index: "akash",
//       body: {
//         aggs: {
//           by_hour: {
//             date_histogram: {
//               field: "date_time",
//               fixed_interval: "1h",
//             },
//             aggs: {
//               by_type: {
//                 terms: {
//                   field: "type.keyword",
//                 },
//                 aggs: {
//                   campaign: {
//                     terms: {
//                       field: "campaign.keyword",
//                     },
//                   },
//                   process_name: {
//                     terms: {
//                       field: "process_name.keyword",
//                     },
//                   },
//                   call_count: {
//                     value_count: {
//                       field: "date_time",
//                     },
//                   },
//                   total_duration: {
//                     sum: { field: "duration" },
//                   },
//                   total_hold: {
//                     sum: { field: "hold" },
//                   },
//                   total_mute: {
//                     sum: { field: "mute" },
//                   },
//                   total_ringing: {
//                     sum: { field: "ringing" },
//                   },
//                   total_transfer: {
//                     sum: { field: "transfer" },
//                   },
//                   total_conference: {
//                     sum: { field: "conference" },
//                   },
//                   unique_calls: {
//                     terms: {
//                       field: "refrence_uuid.keyword",
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//         size: 0,
//         properties: { refrence_uuid: { type: "keyword", fielddata: true } },
//       },
//     });
//     res.send(result);
//   } catch (error) {
//     console.error(error);
//     res.send(error);
//     // res.status(500).send({ error: error.message });
//   }
// });

server.get("/elastic/summary", async (req, res) => {
  console.log("elastic get data called:   ");
  try {
    const result = await client.search({
      index: "ajay",
      body: {
        size: 0,
        aggs: {
          group_by_hour: {
            date_histogram: {
              field: "datetime",
              calendar_interval: "1h",
            },
            aggs: {
              total_duration: {
                sum: {
                  field: "duration",
                },
              },
              total_hold: {
                sum: {
                  field: "hold",
                },
              },
              total_mute: {
                sum: {
                  field: "mute",
                },
              },
              total_ringing: {
                sum: {
                  field: "ringing",
                },
              },
              total_transfer: {
                sum: {
                  field: "transfer",
                },
              },
              total_conference: {
                sum: {
                  field: "conference",
                },
              },
              call_count: {
                value_count: {
                  field: "date_time",
                },
              },
              total_onCall: {
                sum: {
                  field: "callTime",
                },
              },
            },
          },
        },
      },
    });
    console.log(result);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.send(err);
  }
});
