let express = require("express");
let cors = require("cors");
let app = express();
let mongoose = require("mongoose");
let { getSchema, studentSchema } = require("./utils/schemaUtil");
let path = require("path");
let fs = require("fs/promises");
// let model = require("./model/student");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));
app.use(express.json());

app.use(
  cors({
    // origin: [
    //   "https://stdn-res.vercel.app",
    //   "http://localhost:3000",
    //   "http://192.168.0.169:3000",
    // ],
    origin: "*",
    methods: "GET, POST, DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
mongoose
  .connect(
    "mongodb+srv://suryasarisa99:suryamongosurya@cluster0.xtldukm.mongodb.net/Student?retryWrites=true&w=majority",
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
    res.json("Error: connection between Database", error.message);
  });

app.get("/about", async (req, res) => {
  res.send(`<h1>Created By Jaya Surya</h1>`);
});
app.get("/start", (req, res) => {
  res.json("started");
});

app.post("/update/:id", async (req, res) => {
  try {
    let { id } = req.params;
    // let { fname,sname,l } = req.body;
    let student = await getSchema(id).findById(id);
    if (student) {
      student.name = req.body;
      student.save();
      return res.json("updated Name");
    } else return res.json("Invalid Registration Id");
    res.json("sample");
  } catch (err) {
    res.json(err.message);
  }
});

app.post("/update-lock/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let { oldPass, newPass } = req.body;
    id = id.toUpperCase();
    console.log(id, oldPass, newPass);
    let student = await getSchema(id).findById(id);
    if (student) {
      if (student.password === oldPass) {
        student.password = newPass;
        student.save();
        if (newPass === "") return res.json({ mssg: "removedPassword" });
      } else {
        return res.json({ mssg: "PasswordNotMatch" });
      }
      return res.json("password is added");
    } else return res.json("Invalid Registration Id");
  } catch (err) {
    res.json(err.message);
  }
});
app.get("/download/:id", async (req, res) => {
  try {
    let { id } = req.params;
    id = id.toUpperCase();
    let myModel = getSchema(id);
    let obj = await myModel.findById(id);
    if (obj) {
      await fs.writeFile("results.txt", JSON.stringify(obj, null, 2));
      res.download("results.txt");
    } else res.json({ mssg: "InvalidRegId" });
  } catch (err) {
    res.json(err.message);
  }
});
app.post("/photo/:id", async (req, res) => {
  try {
    console.log("post--photo");
    let { id } = req.params;
    let { photo } = req.body;
    let student = await getSchema(id).findById(id);
    if (student) {
      student.photo = photo;
      student.save();
      return res.json("added-photo");
    }
    return res.json("sample");
  } catch (err) {
    res.json(err.message);
  }
});
app.delete("/photo/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let student = await getSchema(id).findById(id);
    if (student) {
      student.photo = "";
      student.save();
      return res.json("deleted-photo");
    } else res.json("id-not-found");
  } catch (err) {
    res.json(err.message);
  }
});

app.post("/lock/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let { pass } = req.body;
    // console.log(id, pass);
    id = id.toUpperCase();
    let student = await getSchema(id).findById(id);
    if (student) {
      if (student.password) return res.json("Already Locked");
      student.password = pass;
      student.save();
      return res.json("isLocked");
    } else return res.json("Invalid Registration Id");
  } catch (err) {
    res.json(err.message);
  }
});

app.get("/ays/:x", async (req, res) => {
  try {
    let yearId = req.params.x;
    console.log(yearId);
    let analysis = await mongoose
      .model("analysis" + yearId, studentSchema)
      .find();
    res.json(analysis);
  } catch (err) {
    res.json(err.message);
  }
});

app.post("/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let { pass } = req.body;
    id = id.toUpperCase();
    // console.log("post :id", id, pass);
    let myModel = getSchema(id);
    let obj = await myModel.findById(id);
    if (obj) {
      if (pass == obj.password) {
        return res.json(obj);
      } else return res.json({ mssg: "passwordNotMatch" });
    } else res.json({ mssg: "InvalidRegId" });
  } catch (err) {
    console.log(err.message);
    res.json(err.message);
  }
});

app.get("/:id", async (req, res) => {
  try {
    let { id } = req.params;
    id = id.toUpperCase();
    console.log(id);
    let myModel = getSchema(id);
    let obj = await myModel.findById(id);
    if (obj) {
      if (!obj?.password) {
        res.json(obj);
      } else return res.json({ mssg: "isLocked" });
    } else res.json({ mssg: "InvalidRegId" });
  } catch (err) {
    console.log(err.message);
    res.json(err.message);
  }
});

app.get("/", (req, res) => {
  res.send("<h1>JayaSurya</h1>");
});

app.listen(process.env.PORT || 4000);
