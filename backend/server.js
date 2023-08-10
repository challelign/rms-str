const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const session = require("express-session");
var MemoryStore = require("memorystore")(session);
const multer = require("multer");
const path = require("path");
const fs = require("fs");

app.use(
  session({
    secret: "334ajnbbasd",
    resave: true,
    name: "expressSessionId",
    saveUninitialized: false,
    rolling: true,
    cookie: { httpOnly: true, maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
  })
);
// parse requests of content-type: application/json
app.use(bodyParser.json());

app.use(cors({ origin: true, credentials: true }));

// prevent CORS problems

// parse requests of content-type: application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// default route
console.log("Test Log log..");
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my application!" });
});

// customers route
require("./src/routes/rms.route.js")(app);

// str routes
require("./src/routes/str.route.js")(app);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./src/uploads";

    // Check if the directory exists, create it if it doesn't
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, files, cb) {
    cb(null, Date.now() + path.extname(files.originalname));
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.array("files"), (req, res) => {
  const files = req.files;
  res.status(200).json({
    message: "Files uploaded successfully",
    fileCount: files.length,
  });
});

//Middleware to handle 404 errors
app.use((req, res, next) => {
  res
    .status(404)
    .json({ status: "ERROR", message: `This ${req.url} URL does not exist` });
});
// set port, listen for requests
app.listen(3001, () => {
  // eslint-disable-next-line no-console
  console.log("Server is running on port 3001");
});
