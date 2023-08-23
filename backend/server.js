const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const session = require("express-session");
var MemoryStore = require("memorystore")(session);

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

// Function to serve all static files
// inside public directory.
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// default route
console.log("Test Log log..");
app.get("/", (req, res) => {
	res.json({ message: "Welcome to my application!" });
});

// customers route
require("./src/routes/rms.route.js")(app);

// str routes
require("./src/routes/str.route.js")(app);

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
