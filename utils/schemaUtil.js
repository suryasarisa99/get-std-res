let { model } = require("mongoose");
let studentSchema = require("../model/student");
let multer = require("multer");
function getSchema(id) {
  let branchId = id.substring(6, 8);
  let startYear = id.substring(0, 2);
  let isLe = id.substring(4, 6);
  startYear = isLe == "5A" ? startYear - 1 : startYear;

  return model(getBranch[branchId] + startYear, studentSchema);
}

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "/phots"),
  filename: (req, file, cb) => cb(null, Date.now() + file.originalname),
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
};
