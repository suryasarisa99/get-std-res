let { Schema, model } = require("mongoose");

let studentSchema = new Schema({
  regId: {
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

module.exports = model("student", studentSchema);
