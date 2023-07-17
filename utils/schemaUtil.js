let { model } = require("mongoose");
let studentSchema = require("../model/student");
let multer = require("multer");
let path = require("path");

function getSchema(id) {
  let branchId = id.substring(6, 8);
  let startYear = id.substring(0, 2);
  let isLe = id.substring(4, 6);
  startYear = isLe == "5A" ? startYear - 1 : startYear;

  return model(startYear + getBranch[branchId], studentSchema);
}

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../photos")),
  filename: (req, file, cb) => cb(null, file.originalname),
});
let getBranch = {
  "01": "CIVIL",
  "02": "EEE",
  "04": "ECE",
  "05": "CSE",
  42: "CSM",
  44: "CSD",
};

module.exports = {
  getSchema,
  storage,
  studentSchema,
};
