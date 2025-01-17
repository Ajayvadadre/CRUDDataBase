
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







[
  (datetime = Date.now()),
  (calltype = calltype),
  (disposetype = disposeType),
  (disposename = disposeName),
  (duration = Date.now() + 3200),
  (agentname = randFullName()),
  (campaignName = campaignData),
  (processnName = processData),
  (leadset = randUuid()),
  (referenceUuid = randUuid()),
  (customerUuid = randUuid()),
  (hold = hold),
  (mute = mute),
  (ringing = ringing),
  (transfer = transfer),
  (conference = conference),
  (call = call),
  (disposetime = Date.now() + 70000),
];



// {
//   datetime: Date.now(),
//   calltype: calltype,
//   disposetype: disposeType,
//   disposename: disposeName,
//   duration: Date.now() + 3200,
//   agentname: randFullName(),
//   campaignName: campaignData,
//   processnName: processData,
//   leadset: randUuid(),
//   referenceUuid: randUuid(),
//   customerUuid: randUuid(),
//   hold: hold,
//   mute: mute,
//   ringing: ringing,
//   transfer: transfer,
//   conference: conference,
//   call: call,
//   disposetime: Date.now() + 70000,
// }











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












INSERT INTO curd.logger_report (date_time, type, dispose_type, dispose_name , duration, agent_name, campaign, process_name, leadset, refrence_uuid, coustomer_uuid	, hold, mute, ringing, transfer, conference, callTime, dispose_time) VALUES ?





array(10) { [0]=> array(10) { ["_id"]=> array(3) { ["hour"]=> int(12) ["campaignName"]=> string(5) "sales" ["processnName"]=> string(3) "Web" } ["call_count"]=> int(3) ["total_duration"]=> int(5210319143852) ["total_hold"]=> int(0) ["total_mute"]=> int(0) ["total_ringing"]=> int(9) ["total_transfer"]=> int(0) ["total_conference"]=> int(0) ["hour"]=> int(12) ["unique_calls"]=> int(3) }





























  let largeData = [];
  let mysqlData = [];
  let campaignData;
  let calltype;
  let disposeType;
  let disposeName;

  let dataCreator = () => {
    for (let index = 0; index < 10; index++) {
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
      calltype = myData.helpers.arrayElement([
        "dispose",
        "missed",
        "autofailed",
        "autodrop",
      ]);
      var disposetime = Math.floor(Math.random() * 10) + 1;
      const workingHours = Math.floor(
        Math.random() * (70000000 - 3600000) + 2000000
      );

      if (calltype == "missed") {
        disposeName = "agent not found";
      } else if (calltype == "autoFail" || calltype == "autoDrop") {
        disposeName = faker.helpers.arrayElement([
          "busy",
          "decline",
          "does not exist",
          "not acceptable",
        ]);
      } else {
        disposeName = faker.helpers.arrayElement([
          "follow up",
          "do not call",
          "external transfer",
        ]);
        if (disposeName == "follow up") {
          disposeType = "callback";
        } else if (disposeName == "do not call") {
          disposeType = "dnc";
        } else {
          disposeType = "etx";
        }
      }
      let ringing = 0;
      let transfer = 0;
      let call = 0;
      let mute = 0;
      let conference = 0;
      let hold = 0;
      var duration = ringing + transfer + call + mute + conference + hold;

      if (
        calltype == "missed" ||
        calltype == "autoFail" ||
        calltype == "autoDrop"
      ) {
        ringing = faker.number.int({ min: 1, max: 10 });
      } else if (calltype == "disposed") {
        const variables = ["transfer", "mute", "conference", "hold"];
        const selectedVariables = faker.helpers.arrayElements(variables, {
          min: 2,
          max: 3,
        });

        selectedVariables.forEach((variable) => {
          call = faker.number.int({ min: 1, max: 300 });
          switch (variable) {
            case "transfer":
              transfer = faker.number.int({ min: 1, max: 300 });
              break;
            case "mute":
              mute = faker.number.int({ min: 1, max: 300 });
              break;
            case "conference":
              conference = faker.number.int({ min: 1, max: 300 });
              break;
            case "hold":
              hold = faker.number.int({ min: 1, max: 300 });
              break;
          }
        });
      }






//Bulk data insert function 

      async function bulkDataInsert(){ 
    
        for (let i = 0; i < 100000; i++) { 
          let ringing = 0;
          let transfer = 0;
          let call = 0;
          let mute = 0;
          let conference = 0;
          let hold = 0;
          let duration = 0;
            var datetime= getRandomTimeOfDay();
            let callType = faker.helpers.arrayElement(['disposed', 'missed', 'autoFail', 'autoDrop']);
            let disposeName;
            let disposeType;
                
            if (callType == 'missed') {
              disposeName = 'agent not found';
            } else if (callType == "autoFail" || callType == "autoDrop") {
              disposeName = faker.helpers.arrayElement(["busy", "decline", "does not exist", "not acceptable"]);
            } else {
              disposeName = faker.helpers.arrayElement(['follow up', 'do not call', 'external transfer']);
              if (disposeName == 'follow up') {
                disposeType = 'callback';
              } else if (disposeName == 'do not call') {
                disposeType = 'dnc';
              } else {
                disposeType = 'etx';
              }
            }
            
            var agents=faker.helpers.arrayElement(['pradeep','panda', 'atul', 'sahil', 'rohit', 'akash', 'anupam', 'ajay', 'ayush',])
            var campaign=faker.helpers.arrayElement(['Insuarance', 'sales', 'marketing', 'finance'])
            var process= faker.helpers.arrayElement(['process1', 'process2', 'process3', 'process4', 'process5'])
            var leadid= Math.floor(Math.random() * 10)+1;
            var referenceuuid= faker.string.uuid();
            var customeruuid= faker.string.uuid();
            
         
            
            if (callType == 'missed' || callType == 'autoFail' || callType == 'autoDrop' ) {
              ringing = faker.number.int({ min: 1, max: 10 });
              duration = ringing+transfer+call+mute+conference+hold;
            } else if (callType == 'disposed') {
              const variables = ['transfer', 'mute', 'conference', 'hold'];
              const selectedVariables = faker.helpers.arrayElements(variables, { min: 2, max: 3 });
              var disposeTime=Math.floor(Math.random() * 10)+1;
              selectedVariables.forEach(variable => {
                call = faker.number.int({ min: 1, max: 300 });
                switch (variable) {
                  case 'transfer':
                    transfer = faker.number.int({ min: 1, max: 300 });
                    break;
                  case 'mute':
                    mute = faker.number.int({ min: 1, max: 300 });
                    break;
                  case 'conference':
                    conference = faker.number.int({ min: 1, max: 300 });
                    break;
                  case 'hold':
                    hold = faker.number.int({ min: 1, max: 300 });
                    break;
                }
            });
          
          duration = ringing+transfer+call+mute+conference+hold;
          
        }
         bulkDatam.push({date_time: datetime, type : callType, dispose_type:disposeType, dispose_name: disposeName , duration:duration, agent_name:agents, campaign:campaign, process_name:process, leadset:leadid, refrence_uuid:referenceuuid, coustomer_uuid:customeruuid	, hold: hold, mute:mute, ringing:ringing, transfer:transfer, conference:conference, callTime:call, dispose_time:disposeTime})
         bulkData.push([datetime,callType, disposeType, disposeName, duration, agents, campaign, process, leadid, referenceuuid, customeruuid, hold, mute, ringing, transfer, conference, call, disposeTime]);
         bulkDataE.push({ index: { _index: 'akash' } });
         bulkDataE.push({date_time: datetime, type : callType, dispose_type:disposeType, dispose_name: disposeName , duration:duration, agent_name:agents, campaign:campaign, process_name:process, leadset:leadid, refrence_uuid:referenceuuid, coustomer_uuid:customeruuid	, hold: hold, mute:mute, ringing:ringing, transfer:transfer, conference:conference, callTime:call, dispose_time:disposeTime})
       }
    }