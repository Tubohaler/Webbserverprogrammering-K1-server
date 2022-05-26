const fs = require("fs");

function readFile(file) {
  return fs.readFileSync(file, "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }
    console.log(data);
  });
}

function writeFile(fileName, input) {
  return fs.writeFile(fileName, input, (err, data) => {
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
