let express = require("express");
let cors = require("cors");
// let Student = require("./model/student");
let app = express();
let mongoose = require("mongoose");
let { getSchema } = require("./utils/schemaUtil");

app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));

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
app.get("/:id", async (req, res) => {
  try {
    let { id } = req.params;
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
