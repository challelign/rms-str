const str = require("../controllers/str.controller");
module.exports = (app) => {
  app.get(
    "/str/:page/:countPerPage/:searchInput/:searchRequested",
    str.findAll
  );
  app.post("/str", str.create);
  app.post("/str/upload", str.uploads);
  app.put("/str/delete", str.deleteFile);
};
