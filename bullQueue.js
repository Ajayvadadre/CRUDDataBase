const Queue = require("bull");
const { createClient } = require("redis");
const cors = require("cors");
const restify = require("restify");
const { json } = require("body-parser");
const port = 3000;
const app = restify.createServer();
app.use(restify.plugins.bodyParser());
app.use(cors({ origin: "localhost:8080", credentials: true }));
async function main() {
  const redisClient = createClient({
    host: "127.0.0.1",
    port: 6379,
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  const userState = new Queue("userState", "redis://127.0.0.1:6379");

  app.listen(port, () => {
    console.log("connected to port:" + port);
  });

  //Main app
  app.get("/", async (req, res) => {
    res.send("get request called");
  });

  //   userState.process(async (job, done) => {
  //     const addInQueue = job.data;
  //     (await redisClient).hSet("userstate", addInQueue);
  //     console.log("addInQueue: ", addInQueue);
  //     console.log("Job processed successfully");
  //     done("Job processed successfully");
  //   });
  async function getRedisData() {
    console.log("getRedisData called");
    const data = (await redisClient).hGetAll("agent1");
    data
      .then((x) => {
        console.log(x);
      })
      .catch((err) => {
        console.log(err);
      });
    // console.log(data);
  }

  app.post("/addInQueue", async (req, res) => {
    const data = req.body;
    let mainData = JSON.parse(data);
    console.log(data);
    if (mainData.dispose !== undefined) {
      getRedisData();
    }
    try {
      (await redisClient).hSet("agent1", mainData);
      res.send("added in queue successfully");
    } catch (err) {
      console.log(err);
      res.send("error while adding in queue");
    }
  });
}

main();
