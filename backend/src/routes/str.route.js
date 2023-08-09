const str = require("../controllers/str.controller");
module.exports = (app) => {
  app.post("/str", str.create);
};
