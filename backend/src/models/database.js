const mysql = require("mysql");
const config = require("../config/database.config");

// create a connection to the database
const connection = mysql.createConnection({
  host: config.HOST,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DATABASE,
});

// open the MySql connection
function connectDB() {
  connection.connect((error) => {
    if (error) {
      console.error("Retrying");
      console.error("Database connection failed, Retrying");
      // I suggest using some variable to avoid the infinite loop.
      setTimeout(connectDB, 2000);
    }
    // eslint-disable-next-line no-console
    else console.log("Database connected successfully :) !");
  });
}
connectDB();

module.exports = connection;
