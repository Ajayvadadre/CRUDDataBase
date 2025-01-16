let largeData = [];
let mysqlData = [];
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

const insertMultiHrData = () => {
  let dataCreator = () => {
    for (let index = 0; index < 100000; index++) {
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

      //-------- adding all data--------
      // largeData.push([
      //   getRandomTimeOfDay(),
      //   calltype,
      //   disposeType,
      //   disposeName,
      //   Date.now() + 3200,
      //   randFullName(),
      //   campaignData,
      //   processData,
      //   randUuid(),
      //   randUuid(),
      //   randUuid(),
      //   hold,
      //   mute,
      //   ringing,
      //   transfer,
      //   conference,
      //   call,
      //   Date.now() + 70000
      // ]);

      largeData.push({
        index: { _index: "ajay" },
        datetime: getRandomTimeOfDay(),
        calltype: calltype,
        disposetype: disposeType,
        disposename: disposeName,
        duration: Date.now() + 3200,
        agentname: randFullName(),
        campaignName: campaignData,
        processnName: processData,
        leadset: randUuid(),
        referenceUuid: randUuid(),
        customerUuid: randUuid(),
        hold: hold,
        mute: mute,
        ringing: ringing,
        transfer: transfer,
        conference: conference,
        call: call,
        disposetime: Date.now() + 70000,
      });
    }
  };

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
};

module.exports = {
  insertMultiHrData,
};
