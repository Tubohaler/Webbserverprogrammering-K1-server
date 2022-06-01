const fs = require("fs");

function readFile(file) {
  const rawData = fs.readFileSync(file, "utf8");
  return JSON.parse(rawData);
}

function writeFile(fileName, input) {
  const newData = JSON.stringify(input);
  fs.writeFile(fileName, newData, (err, data) => {
    if (err) {
      console.log(err);
    }
    console.log(data);
  });
}

module.exports = {
  readFile,
  writeFile,
};
