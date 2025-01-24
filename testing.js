const restify = require("restify");
const mongodb = require(" mongoose");

   
   
   
   
   userState.process(async (job, done) => {
      const addInQueue = job.data;
      (await redisClient).hSet("userstate", addInQueue);
      console.log("addInQueue: ", addInQueue);
      console.log("Job processed successfully");
      done("Job processed successfully");
    });