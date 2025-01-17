let largeData = [];
let mysqlData = [];
let bulkData = [];
let bulkDatam = [];
let bulkDataE = [];
let campaignData;
let calltype;
let disposeType;
let disposeName;

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

// const insertMultiHrData = () => {
//   let dataCreator = () => {
//     for (let index = 0; index < 10; index++) {
//       let ringing = 0;
//       let transfer = 0;
//       let call = 0;
//       let mute = 0;
//       let conference = 0;
//       let hold = 0;
//       campaignData = myData.helpers.arrayElement([
//         "marketing",
//         "sales",
//         "insurance",
//       ]);
//       processData = myData.helpers.arrayElement([
//         "Auto",
//         "Inbound",
//         "OnDemand",
//         "Web",
//       ]);
//       calltype = myData.helpers.arrayElement([
//         "dispose",
//         "missed",
//         "autofailed",
//         "autodrop",
//       ]);
//       var disposetime = Math.floor(Math.random() * 10) + 1;
//       const workingHours = Math.floor(
//         Math.random() * (70000000 - 3600000) + 2000000
//       );

//       if (calltype == "missed") {
//         disposeName = "agent not found";
//         duration = ringing + transfer + call + mute + conference + hold;
//       } else if (calltype == "autoFail" || calltype == "autoDrop") {
//         disposeName = faker.helpers.arrayElement([
//           "busy",
//           "decline",
//           "does not exist",
//           "not acceptable",
//         ]);
//       } else {
//         disposeName = faker.helpers.arrayElement([
//           "follow up",
//           "do not call",
//           "external transfer",
//         ]);
//         if (disposeName == "follow up") {
//           disposeType = "callback";
//         } else if (disposeName == "do not call") {
//           disposeType = "dnc";
//         } else {
//           disposeType = "etx";
//         }
//       }

//       if (
//         calltype == "missed" ||
//         calltype == "autoFail" ||
//         calltype == "autoDrop"
//       ) {
//         ringing = faker.number.int({ min: 1, max: 10 });
//         duration = ringing + transfer + call + mute + conference + hold;
//       } else if (calltype == "disposed") {
//         const variables = ["transfer", "mute", "conference", "hold"];
//         const selectedVariables = faker.helpers.arrayElements(variables, {
//           min: 2,
//           max: 3,
//         });

//         selectedVariables.forEach((variable) => {
//           call = faker.number.int({ min: 1, max: 300 });

//           switch (variable) {
//             case "transfer":
//               transfer = faker.number.int({ min: 1, max: 300 });
//               break;
//             case "mute":
//               mute = faker.number.int({ min: 1, max: 300 });
//               break;
//             case "conference":
//               conference = faker.number.int({ min: 1, max: 300 });
//               break;
//             case "hold":
//               hold = faker.number.int({ min: 1, max: 300 });
//               break;
//           }
//         });

//         duration = ringing + transfer + call + mute + conference + hold;
//       }

//       //-------- adding all data--------
//       // Data for mySQL
//       // largeData.push([
//       //   getRandomTimeOfDay(),
//       //   calltype,
//       //   disposeType,
//       //   disposeName,
//       //   duration,
//       //   randFullName(),
//       //   campaignData,
//       //   processData,
//       //   randUuid(),
//       //   randUuid(),
//       //   randUuid(),
//       //   hold,
//       //   mute,
//       //   ringing,
//       //   transfer,
//       //   conference,
//       //   call,
//       //   disposetime,
//       // ]);

//       //Data for elasticsearch
//       // largeData.push({
//       //   index: { _index: "ajay" },
//       //   datetime: getRandomTimeOfDay(),
//       //   calltype: calltype,
//       //   disposetype: disposeType,
//       //   disposename: disposeName,
//       //   duration: ringing + transfer + call + mute + conference + hold,
//       //   agentname: randFullName(),
//       //   campaignName: campaignData,
//       //   processnName: processData,
//       //   leadset: randUuid(),
//       //   referenceUuid: randUuid(),
//       //   customerUuid: randUuid(),
//       //   hold: hold,
//       //   mute: mute,
//       //   ringing: ringing,
//       //   transfer: transfer,
//       //   conference: conference,
//       //   call: call,
//       //   disposetime: disposetime,
//       // });

//       //Data for mongo
//       largeData.push({
//         datetime: getRandomTimeOfDay(),
//         calltype: calltype,
//         disposetype: disposeType,
//         disposename: disposeName,
//         duration: ringing + transfer + call + mute + conference + hold,
//         agentname: randFullName(),
//         campaignName: campaignData,
//         processnName: processData,
//         leadset: randUuid(),
//         referenceUuid: randUuid(),
//         customerUuid: randUuid(),
//         hold: hold,
//         mute: mute,
//         ringing: ringing,
//         transfer: transfer,
//         conference: conference,
//         call: call,
//         disposetime: disposetime,
//       });
//     }
//   };

//   const data = dataCreator();
//   return largeData;

//   //creating chunk data

//   // let i,
//   //   temparray,
//   //   chunk = 10;
//   // for (i = 0; i < largeData.length; i += chunk) {
//   //   temparray = largeData.slice(i, i + chunk);
//   //   insertBigData(temparray);
//   // }
//   // console.log(temparray);
//   // //
//   // let tempData;
//   // let chunkData = 20;
//   // for (let i = 0; i < largeData.length; i = i + chunkData) {
//   //   tempData = largeData.slice(i, chunkData);
// };

async function bulkDataInsert() {
  for (let i = 0; i < 100000; i++) {
    let ringing = 0;
    let transfer = 0;
    let call = 0;
    let mute = 0;
    let conference = 0;
    let hold = 0;
    let duration = 0;
    var datetime = getRandomTimeOfDay();
    let callType = faker.helpers.arrayElement([
      "disposed",
      "missed",
      "autoFail",
      "autoDrop",
    ]);
    let disposeName;
    let disposeType;

    if (callType == "missed") {
      disposeName = "agent not found";
      disposeType = "missed";
    } else if (callType == "autoFail" || callType == "autoDrop") {
      disposeName = faker.helpers.arrayElement([
        "busy",
        "decline",
        "does not exist",
        "not acceptable",
      ]);
      disposeType = "none";
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

    var agents = faker.helpers.arrayElement([
      "pradeep",
      "panda",
      "atul",
      "sahil",
      "rohit",
      "akash",
      "anupam",
      "ajay",
      "ayush",
    ]);
    var campaign = faker.helpers.arrayElement([
      "Insuarance",
      "sales",
      "marketing",
      "finance",
    ]);
    var process = faker.helpers.arrayElement([
      "process1",
      "process2",
      "process3",
      "process4",
      "process5",
    ]);
    var leadid = Math.floor(Math.random() * 10) + 1;
    var referenceuuid = faker.string.uuid();
    var customeruuid = faker.string.uuid();

    if (
      callType == "missed" ||
      callType == "autoFail" ||
      callType == "autoDrop"
    ) {
      ringing = faker.number.int({ min: 1, max: 10 });
      duration = ringing + transfer + call + mute + conference + hold;
    } else if (callType == "disposed") {
      const variables = ["transfer", "mute", "conference", "hold"];
      const selectedVariables = faker.helpers.arrayElements(variables, {
        min: 2,
        max: 3,
      });
      var disposeTime = Math.floor(Math.random() * 10) + 1;
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

      duration = ringing + transfer + call + mute + conference + hold;
    }
    // Mongodb database
    // bulkDatam.push({
    //   datetime: datetime  ,
    //   calltype: callType,
    //   disposetype: disposeType,
    //   disposename: disposeName,
    //   duration: duration,
    //   agentname: agents,
    //   campaignName: campaign,
    //   processName: process,
    //   leadset: leadid,
    //   refrence_uuid: referenceuuid,
    //   coustomer_uuid: customeruuid,
    //   hold: hold,
    //   mute: mute,
    //   ringing: ringing,
    //   transfer: transfer,
    //   conference: conference,
    //   call: call,
    //   disposetime: Math.floor(Math.random() * 10) + 1,
    // });
    // console.log(bulkDatam)
    // return bulkDatam;

    // mysql database
    // bulkData.push([
    //   getRandomTimeOfDay(),
    //   callType,
    //   disposeType,
    //   disposeName,
    //   duration,
    //   randFullName(),
    //   campaign,
    //   process,
    //   randUuid(),
    //   randUuid(),
    //   randUuid(),
    //   hold,
    //   mute,
    //   ringing,
    //   transfer,
    //   conference,
    //   call,
    //   Math.floor(Math.random() * 10) + 1,
    // ]);

    //Elastic database
    bulkDataE.push({ index: { _index: "ajay" } });
    bulkDataE.push({
      datetime: datetime,
      calltype: callType,
      disposetype: disposeType,
      disposename: disposeName,
      duration: duration,
      agentname: agents,
      campaignName: campaign,
      processName: process,
      leadset: leadid,
      refrence_uuid: referenceuuid,
      coustomer_uuid: customeruuid,
      hold: hold,
      mute: mute,
      ringing: ringing,
      transfer: transfer,
      conference: conference,
      call: call,
      disposetime: disposeTime,
    });
    
  }
}
 bulkDataInsert()
// console.log();

function getRandomTimeOfDay() {
  const startOfDay = new Date();
  startOfDay.setHours(9, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(18, 0, 0, 0);
  const randomTimestamp = new Date(
    startOfDay.getTime() +
      Math.random() * (endOfDay.getTime() - startOfDay.getTime())
  );
  return randomTimestamp;
}

module.exports = {
  bulkDataInsert,
  bulkDatam
};
