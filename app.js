const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "hvme12#tyu7834?[]powqrdgty";

//Below is the steps to connect to the MongoDB Database
const mongoUrl = "mongodb://127.0.0.1:27017/hostleRegister";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

app.listen(5000, () => {
  console.log("Server Started");
});

const cors = require("cors");
// Allow all origins
// app.use(cors());
// // Allow specific origin(s)
// app.use(
//   cors({
//     origin:
//       "https://hostel-management-frontend-feghdo5nr-amankr025s-projects.vercel.app/",
//   })
// );

require("./schema");
const User = mongoose.model("UserInfo");

//To Register New User
app.post("/register", async (req, res) => {
  const { rollNumber, Name, email, password } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ rollNumber });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    await User.create({
      rollNumber,
      Name,
      email,
      password: encryptedPassword,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

// Your code
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static(path.resolve(__dirname, "client", "build")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "client", "build", "index.html"),
      function (err) {
        if (err) {
          res.status(500).send(err);
        }
      }
    );
  });
}
// Your code

// To Login in the websites
app.post("/login-user", async (req, res) => {
  const { rollNumber, password } = req.body;

  const user = await User.findOne({ rollNumber });
  if (!user) {
    return res.json({ error: "User Not Found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({}, JWT_SECRET);

    if (res.status(201)) {
      return res.json({ status: "OK", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "INVALID PASSWORD" });
});
//to update profile
require("./schema");
const pro = mongoose.model("profile");

app.post("/updateform", async (req, res) => {
  const reasult = await pro.create(req.body);
  res.send({ status: "ok" });
});

require("./schema");
const Admin = mongoose.model("adminData");

// ********************************************
// ********************************************
// ************* ADMIN REGISTRATION ***********
app.post("/admin-register", async (req, res) => {
  const { adminId, adminPassword } = req.body;

  const encryptedPassword = await bcrypt.hash(adminPassword, 10);
  try {
    const oldUser = await Admin.findOne({ adminId });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    await Admin.create({
      adminId,
      adminPassword: encryptedPassword,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

// *********************************
// *********************************
//ADMIN LOGIN AUTHENTICATION
app.post("/admin-user", async (req, res) => {
  const { adminId, adminPassword } = req.body;

  const admin = await Admin.findOne({ adminId });
  if (!admin) {
    return res.json({ error: "User Not Found" });
  }
  if (await bcrypt.compare(adminPassword, admin.adminPassword)) {
    if (res.status(201)) {
      return res.json({ status: "OK" });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "INVALID PASSWORD" });
});
app.get("/getprofile/:roll", async (req, res) => {
  const rollnum = req.params.roll;
  const user = await pro.findOne({
    $or: [{ rollnumber: { $regex: rollnum } }],
  });

  if (user) res.send(user);
  else res.send("not");
});
app.get("/getname/:roll", async (req, res) => {
  const rollnum = req.params.roll;
  const profilename = await User.findOne({
    $or: [{ rollNumber: { $regex: rollnum } }],
  });
  if (profilename) res.send(profilename);
  else res.send("not");
});
