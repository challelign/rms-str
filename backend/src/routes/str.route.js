const str = require("../controllers/str.controller");
module.exports = (app) => {
	app.get(
		"/str/:page/:countPerPage/:searchInput/:searchRequested",
		str.findAll
	);
	app.post("/str", str.create);
	app.put("/str/:id", str.updateCustomer);
	app.put("/str/upload/:id", str.updateFile);
};
