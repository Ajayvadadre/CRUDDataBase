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
  let largeData = [];
  let campaignData;
  let calltype;
  let disposeType;
  let disposeName;
  let ringing = 0;
  let transfer = 0;
  let call = 0;
  let mute = 0;
  let conference = 0;
  let hold = 0;

  let dataCreator = () => {
    for (let index = 0; index < 50; index++) {
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
      var duration = ringing + transfer + call + mute + conference + hold;
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

      //-------- adding all data--------
      largeData.push([
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
        (mute =mute),
        (ringing = ringing),
        (transfer =transfer),
        (conference =conference),
        (call =call),
        (disposetime = Date.now() + 70000),
      ]);
    }
  };
  const data = dataCreator();
  return largeData;

  //creating chunk data

  // let i,
  //   temparray,
  //   chunk = 10;
  // for (i = 0; i < largeData.length; i += chunk) {
  //   temparray = largeData.slice(i, i + chunk);
  //   insertBigData(temparray);
  // }
  // console.log(temparray);
  // //
  // let tempData;
  // let chunkData = 20;
  // for (let i = 0; i < largeData.length; i = i + chunkData) {
  //   tempData = largeData.slice(i, chunkData);
  // }
};

module.exports = {
  insertMultiHrData,
};

// disposeType = myData.helpers.arrayElement(["Callback", "DNC", "etx"]);
// disposeName = myData.helpers.arrayElement(["Followup", "Reasons", "etx"]);
// disposeType = myData.helpers.arrayElement(["callback", "dnc", "etx"]);
