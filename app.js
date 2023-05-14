let express = require("express");
let cors = require("cors");
// let Student = require("./model/student");
let app = express();
let mongoose = require("mongoose");
let { getSchema } = require("./utils/schemaUtil");

app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: "GET, POST",
  })
);

mongoose
  .connect(
    "mongodb+srv://suryasarisa99:suryamongosurya@cluster0.xtldukm.mongodb.net/Students?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.get("/about", async (req, res) => {
  res.send(`<h1>Created By Jaya Surya</h1>`);
});
app.get("/start", (req, res) => {
  res.json("started");
});

app.post("/update/:id", async (req, res) => {
  let { id } = req.params;
  let { name } = req.body;
  let student = await getSchema(id).findById(id);
  if (student) {
    student.name = name;
    student.save();
    return res.json("updated Name");
  } else return res.json("Invalid Registration Id");
});

app.lock("/lock/:id", async (req, res) => {
  let { id } = req.params;
  let { password } = req.body;
  let student = await getSchema(id).findById(id);
  if (student) {
    student.password = password;
    student.save();
    return res.json("updated Name");
  } else return res.json("Invalid Registration Id");
});

app.get("/sub/:id", async (req, res) => {
  try {
    let { id } = req.params;
    id = id.toUpperCase();
    let myModel = getSchema(id);
    let obj = await myModel.findById(id);
    if (obj) res.json(obj.subjects);
    else res.json({ mssg: "InvalidRegId" });
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/update-name/:id/:name", async (req, res) => {
  let { id, name } = req.params;
  id = id.toUpperCase();
  let student = await getSchema(id).findById(id);
  if (name === "_") name = "";
  else name = name.replace("_", " ");
  if (student) {
    student.name = name;
    student.save();
    return res.json("Name is Updated");
  } else return res.json("Invalid Registration Id");
});

app.get("/:id", async (req, res) => {
  try {
    let { id } = req.params;
    id = id.toUpperCase();
    console.log(id);
    let myModel = getSchema(id);
    let obj = await myModel.findById(id);
    if (obj) res.json(obj);
    else res.json({ mssg: "InvalidRegId" });
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/", (req, res) => {
  res.send("<h1>JayaSurya</h1>");
});

app.listen(process.env.PORT || 4000);
