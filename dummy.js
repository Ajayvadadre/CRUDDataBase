
//Column names
//datetime
//type
//disposeType
//disposeName
//duration
//agenname
//campaignName
//processName
//leadset
//referenceUuid
//customerUuid

// ---- duration ------
//hold
//mute
//ringing
//transfer
//conference
//call
//-- -- -- -- -- --- - -
//disposetime























const util = require("util");
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
const moment = require("moment");

const insertMultiHrData = () => {
  let campaignData;
  let type;
  let disposeType;
  let disposeName;
  let largeData = [];
  let dataCreator = () => {
    for (let index = 0; index < 50000; index++) {
      campaignData = myData.helpers.arrayElement([
        "marketing",
        "sales",
        "insurance",
      ]);
      processData = myData.helpers.arrayElement([
        "Auto",
        "Inbound",
        "OnDemand",
        "Web",
      ]);
      disposeType = myData.helpers.arrayElement(["Callback", "DNC", "etx"]);
      disposeName = myData.helpers.arrayElement(["Followup", "Reasons", "etx"]);
      type = myData.helpers.arrayElement([
        "dispose",
        "missed",
        "autofailed",
        "autodrop",
      ]);
      disposeType = myData.helpers.arrayElement(["callback", "dnc", "etx"]);

      const workingHours = Math.floor(
        Math.random() * (70000000 - 3600000) + 2000000
      ); // Generate random working hours
      largeData.push([
        (datetime = Date.now()),
        (type = type),
        (disposetype = disposeType),
        (disposename = disposeName),
        (duration = Date.now() + 3200),
        (agentname = randFullName()),
        (campaignName = campaignData),
        (processnName = processData),
        (leadset = randUuid()),
        (referenceUuid = randUuid()),
        (customerUuid = randUuid()),
        (hold = Date.now() + 20000),
        (mute = Date.now() + 10000),
        (ringing = Date.now() + 7000),
        (transfer = Date.now() + 7000),
        (conference = Date.now() + 7000),
        (oncall = Date.now() + 700000),
        (disposetime = Date.now() + 70000),
      ]);
    }
  };
  dataCreator();
  //creating chunk data
  let i,
    temparray,
    chunk = 10;
  for (i = 0; i < largeData.length; i += chunk) {
    temparray = largeData.slice(i, i + chunk);
    insertBigData(temparray);
  }
  console.log(temparray);
  //
  let tempData;
  let chunkData = 20;
  for (let i = 0; i < largeData.length; i = i + chunkData) {
    tempData = largeData.slice(i, chunkData);
  }

  function insertBigData(temparray) {
    return new Promise((resolve, reject) => {
      var sqlQuery = `INSERT INTO  mysql_userdata(datetime	,type	,disposetype,	disposename	,duration,	agentname	,campaignName	,processName	,leadset,	referenceUuid	,customerUuid,	hold	,mute	,ringing,	transfer	,conference	,oncall	,disposetime	) VALUES ? `;
      var query = connection.query(
        sqlQuery,
        [temparray],
        (sqlError, sqlResult) => {
          if (sqlError) {
            console.log(sqlError);
            return reject(sqlError);
          } else {
            const pushToMongo = axios.post(
              "http://localhost:3001/mongo/multiData",
              temparray
            );
            const pushToElastic = axios.post(
              "http://localhost:3002/elasticsearch/bulkdata",
              temparray
            );
            return resolve(sqlResult);
          }
        }
      );
    });
  }
};
// insertMultiHrData();


module.exports = {
  insertMultiHrData
}