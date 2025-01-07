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

//Get data
server.get("/redis/get/:redisValue", async (req, res) => {
  let keyName = req.params.rediValue;
  let redisData = await redis.set(keyName, "value");
  console.log(redisData);
  redis.zrange("useradata", 0, 2, "WITHSCORES", (err, res) => {
    client.zrange('myset', 0, -1, 'WITHSCORES', (err, reply) => {
        if (err) {
          console.error(err);
        } else {
          const jsonData = reply[0][1];
          const json = JSON.parse(jsonData);
          console.log(json);
        }
      });
  });

  try {
    redis.get(keyName, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log("Get data successfull", result);
    });
  } catch (error) {
    console.log(error);
  }
});

//create data
server.post("/redis/create", async (req, res) => {
  const data = req.body;
  console.log("useradata" + data);
  const mainData = JSON.stringify(data);
  console.log(mainData);
  let dataUpload = await redis.zadd(
    "userData",
    1,
    mainData,
    (err, response) => {
      if (err) {
        console.log(err);
      }
      console.log("successfully added" + response);
    }
  );
  try {
    console.log("Added data successfully");
    res.send("Created data successfully", dataUpload);
  } catch (error) {
    console.log(error);
    res.send("Create data error: " + error);
  }
});

server.del("/redis/delete", async (req, res) => {
  const { username, password } = req.body;
  console.log(data);
  await redis.zrem("userData", () => {});
  try {
    console.log("Deleted data successfully");
    res.send("Deleted data successfully");
  } catch (error) {
    console.log(error);
    res.send("Deleted data error: " + error);
  }
});
// server.put("/redis/update", async (req, res) => {
//   const { key, value } = req.body;
//   console.log(data);
//   await redis.set(key, value);
//   try {
//     console.log("Added data successfully");
//     res.send("Created data successfully");
//   } catch (error) {
//     console.log(error);
//     res.send("Create data error: " + error);
//   }
// });

//delete data

//Documentation

redis.zadd("sortedSet", 1, "one", 2, "dos", 4, "quatro", 3, "three");
redis.zrange("sortedSet", 0, 2, "WITHSCORES").then((elements) => {
  // ["one", "1", "dos", "2", "three", "3"] as if the command was `redis> ZRANGE sortedSet 0 2 WITHSCORES`
  console.log(elements);
});

// All arguments are passed directly to the redis server,
// so technically ioredis supports all Redis commands.
// The format is: redis[SOME_REDIS_COMMAND_IN_LOWERCASE](ARGUMENTS_ARE_JOINED_INTO_COMMAND_STRING)
// so the following statement is equivalent to the CLI: `redis> SET mykey hello EX 10`
redis.set("mykey", "hello", "EX", 10);

server.listen(port, () => {
  console.log("listening on: " + port);
});
