const Redis = require("ioredis");
const dotenv = require("dotenv");
dotenv.config();
const redis = new Redis();
const restify = require("restify");
const server = restify.createServer();
const port = process.env.PORT;
server.use(restify.plugins.bodyParser());

server.get("/", async (req, res) => {
  console.log("Connected successfully");
  res.send("Connected redis successfully");
});

// Get data
server.get("/redis/get/:redisValue", async (req, res) => {
  const keyName = req.params.redisValue;
  const userName = req.params.userName;
  try {
    console.log(keyName);
    // const redisHgetAll = await redis.hgetall();
    const redisData = await redis.zrange(
      keyName,
      0,
      2,
      "WITHSCORES",
    );
    res.send(redisData);
    console.log(redisData);
  } catch (error) {
    console.log(error);
    res.send("Error retrieving data from Redis");
  }
});

// Create data
server.post("/redis/create", async (req, res) => {
  const keyName = req.body.keyName;
  const data = req.body;
  const score = req.body.id;
  const mainData = JSON.stringify(data); 
  const scoreTime=  Date.now();
  console.log(scoreTime);

  try {
    // const response = await redis.zadd(keyName, 1, mainData);
    // const redisHget = await redis.hset(userName, data);
    const response = await redis.zincrby(keyName, scoreTime, mainData);
    res.send("Created data successfully");
  } catch (error) {
    console.error(error);
    res.send("Error creating data in Redis");
  }
});

// Delete data
server.del("/redis/delete/:keyName", async (req, res) => {
  // const { username, password } = req.body;
  const keyName = req.params.keyName;
  try {
    const redisHdel = await redis.del(keyName);
    // const response = await redis.zrem(keyName, username);
    res.send("Deleted data successfully");
  } catch (error) {
    console.error(error);
    res.send("Error deleting data from Redis");
  }
});

server.listen(port, () => {
  console.log("listening on: " + port);
});
