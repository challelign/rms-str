const str = require("../controllers/str.controller");
module.exports = (app) => {
	app.get(
		"/str/:page/:countPerPage/:searchInput/:searchRequested",
		str.findAll
	);
	app.post("/str", str.create);
	app.put("/str/:customerId", str.updateCustomer);
};
