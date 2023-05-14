let { Schema, model } = require("mongoose");

let studentSchema = new Schema({
  _id: {
    type: String,
    require: true,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  "1-2": {
    subjects: {},
    labs: {},
  },
  "2-1": {
    subjects: {},
    labs: {},
  },
});

module.exports = studentSchema;
