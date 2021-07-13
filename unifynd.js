const fs = require("fs");

let data = fs.readFileSync("data/users.json");
let myObject = JSON.parse(data);

function GetSortOrder(prop) {
  return function (a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  };
}

const csvFilePath = "data/users.csv";
const csv = require("csvtojson");
csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    jsonObj.forEach((data) => {
      const {
        "User ID": user_id,
        "First Name": first_name,
        "Last Name": last_name,
        "User Name": user_name,
        "User Type": user_type,
        "Last Login Time": last_login_time,
      } = data;
      const newData = {
        user_id: parseInt(user_id),
        first_name: first_name,
        last_name: last_name,
        user_name: user_name,
        user_type: user_type,
        last_login_time: last_login_time,
      };
      myObject.push(newData);
    });
  })
  .then(() => {
    xml2js = require("xml2js");
    var parser = new xml2js.Parser();
    fs.readFile(__dirname + "/data/users.xml", function (err, data) {
      parser.parseString(data, function (err, result) {
        result.users.user.map((e) => {
          const { userid, firstname, surname, username, type, lastlogintime } =
            e;
          const [nfirstname] = firstname;
          const [nsurname] = surname;
          const [nusername] = username;
          const [ntype] = type;
          const [nlastlogintime] = lastlogintime;

          const newData = {
            user_id: parseInt(e.userid),
            first_name: nfirstname,
            last_name: nsurname,
            user_name: nusername,
            user_type: ntype,
            last_login_time: nlastlogintime,
          };

          myObject.push(newData);
        });
        myObject.sort(GetSortOrder("user_id"));
        const jsonString = JSON.stringify(myObject);
        fs.writeFileSync("examples/users.json", jsonString);

        data = fs.readFileSync("examples/users.json");
        myObject = JSON.parse(data);

        const csvwriter = require("csv-writer");

        var createCsvWriter = csvwriter.createObjectCsvWriter;

        const csvWriter = createCsvWriter({
          path: "examples/users.csv",
          header: [
            { id: "user_id", title: "User ID" },
            { id: "first_name", title: "First Name" },
            { id: "last_name", title: "Last Name" },
            ,
            { id: "user_name", title: "User Name" },
            { id: "user_type", title: "Type" },
            { id: "last_login_time", title: "Last Login Time" },
          ],
        });

        csvWriter
          .writeRecords(myObject)
          .then(() => console.log("Data uploaded into csv successfully"));

        let final = "";
        // data = fs.readFileSync("newUsers.json");
        myObject = JSON.parse(data);
        console.log(myObject.length);
        var jsonxml = require("jsontoxml");
        for (let i = 0; i < myObject.length; i++) {
          var xml = jsonxml({
            user: [
              { name: "userid", text: myObject[i].user_id },
              { name: "firstname", text: myObject[i].first_name },
              { name: "surname", text: myObject[i].last_name },
              { name: "username", text: myObject[i].user_name },
              { name: "type", text: myObject[i].user_type },
              { name: "lastlogintime", text: myObject[i].last_login_time },
            ],
          });
          final += xml;
        }
        final = jsonxml({
          users: final,
        });

        fs.writeFile("examples/users.xml", final, (err) => {
          if (err) console.log(err);
          else {
            console.log("File written successfully\n");
          }
        });
      });
    });
  });
