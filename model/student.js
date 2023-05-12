let { Schema, model } = require("mongoose");

let studentSchema = new Schema({
  _id: {
    type: String,
    require: true,
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
