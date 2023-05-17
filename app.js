let express = require("express");
let cors = require("cors");
let app = express();
let mongoose = require("mongoose");
let { getSchema } = require("./utils/schemaUtil");
let path = require("path");
let fs = require("fs/promises");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));
app.use(express.json());

app.use(
  cors({
    origin: [
      "https://stdn-res.vercel.app",
      "http://localhost:3000",
      "http://192.168.0.169:3000",
    ],
    // origin: "*",
    methods: "GET, POST",
    allowedHeaders: ["Content-Type", "Authorization"],
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
  // let { fname,sname,l } = req.body;
  let student = await getSchema(id).findById(id);
  if (student) {
    student.name = req.body;
    student.save();
    return res.json("updated Name");
  } else return res.json("Invalid Registration Id");
  res.json("sample");
});

app.post("/update-lock/:id", async (req, res) => {
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
});
app.get("/download/:id", async (req, res) => {
  let { id } = req.params;
  id = id.toUpperCase();
  let myModel = getSchema(id);
  let obj = await myModel.findById(id);
  if (obj) {
    await fs.writeFile("results.txt", JSON.stringify(obj, null, 2));
    res.download("results.txt");
  } else res.json({ mssg: "InvalidRegId" });
});
app.post("/photo/:id", async (req, res) => {
  console.log("post--photo");
  let { id } = req.params;
  let { photo } = req.body;
  let student = await getSchema(id).findById(id);
  if (student) {
    student.photo = photo;
    student.save();
  }
  return res.json("sample");
});

app.post("/lock/:id", async (req, res) => {
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
});

// app.get("/sub/:id", async (req, res) => {
//   try {
//     let { id } = req.params;
//     id = id.toUpperCase();
//     let student = await getSchema(id).findById(id);

//     if (student)
//       res.json({
//         sem1: student["1-2"].subjects,
//         sem2: student["2-1"].subjects,
//       });
//     else res.json({ mssg: "InvalidRegId" });
//   } catch (err) {
//     return res.json("Error Occured");
//     console.log(err.message);
//   }
// });

// app.get("/update-name/:id/:name", async (req, res) => {
//   let { id, name } = req.params;
//   id = id.toUpperCase();
//   let student = await getSchema(id).findById(id);
//   if (name === "_") name = "";
//   else name = name.replace("_", " ");
//   if (student) {
//     student.name = name;
//     student.save();
//     return res.json("Name is Updated");
//   } else return res.json("Invalid Registration Id");
// });

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
  }
});

app.get("/", (req, res) => {
  res.send("<h1>JayaSurya</h1>");
});

app.listen(process.env.PORT || 4000);
