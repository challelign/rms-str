const big_withdrow = require("../controllers/big_withdrowal.controllers");
const shareholder = require("../controllers/shareholders.controllers");
const top_depositor = require("../controllers/top_depositor.controllers");
const authentication = require("../controllers/save_user.controllers");
const dormant_accounts = require("../controllers/dormant_accounts.controllers");
const dormant_accounts_below_100 = require("../controllers/dormant_accounts_below_100.controllers");
const below_500 = require("../controllers/below_500_thousand.controllers");
const logged_user = require("../controllers/logged_user.controllers");
const potential_customer = require("../controllers/potential_customer.controllers");
const fcy_customer = require("../controllers/fcyCustomer.controllers");
const fcy_payment = require("../controllers/fcyPayment.controllers");
const prominentCustomer = require("../controllers/ProminentCustomer.controllers");
module.exports = (app) => {
	app.post("/fcy", fcy_customer.create);
	app.get(
		"/fcy/all/:page/:countPerPage/:searchInput/:searchRequested",
		fcy_customer.findAll
	);
	//

	app.post("/prominent_customer", prominentCustomer.create);

	app.get(
		"/prominent_customer/all/:page/:countPerPage/:searchInput/:searchRequested",
		prominentCustomer.findAll
	);

	app.put("/prominent_customer/:customerId", prominentCustomer.updateCustomer);
	app.delete("/prominent_customer/:fcyCustomerId", prominentCustomer.delete);

	//
	app.post("/fcyPayment", fcy_payment.create);
	app.delete("/fcy/:fcyCustomerId", fcy_customer.delete);
	app.delete("/fcy_payment/:deleteCustomerPaymentId", fcy_payment.delete);
	app.get(
		"/fcy_payment/all/:page/:countPerPage/:searchInput/:searchRequested/:fcyCustomerId",
		fcy_payment.FcyPayment
	);
	app.put("/fcyCustomer/:customerId", fcy_customer.updateCustomer);

	// create a new customer
	app.post("/potential_customers", potential_customer.create);

	app.get(
		"/potential_customer/all/:page/:countPerPage/:searchInput/:searchRequested",
		potential_customer.findAll
	);

	// app.get("/below_500/all/:page/:countPerPage", below_500.findAll);
	//  app.get(
	//    "/dormants-account-below-one-hundred/all/:page/:countPerPage/:searchInput/:searchRequested",
	//    dormant_accounts_below_100.findAll
	//  );
	app.get(
		"/below_500/all/:page/:countPerPage/:searchInput/:searchRequested",
		below_500.findAll
	);

	app.put("/below_500/:reportId", below_500.update);

	app.get(
		"/logged_user/all/:page/:countPerPage/:searchInput/:searchRequested",
		logged_user.findAll
	);
	app.get(
		"/logged_user_leading_branch/all/:page/:countPerPage/:searchInput/:searchRequested",
		logged_user.findLeadingBranchAll
	);
	app.get(
		"/logged_user_leading_user/all/:page/:countPerPage/:searchInput/:searchRequested",
		logged_user.findLeadingUserAll
	);
	app.delete("/potential_customer/:customerId", potential_customer.delete);
	app.put("/potential_customer/:customerId", potential_customer.update);
	app.put(
		"/potential_customer_status/:customerId",
		potential_customer.updateStatus
	);
	app.post("/login", authentication.login);

	app.post("/logout", authentication.logout);
	app.post("/autorized", authentication.isAutorized);
	// retrieve all customers
	app.get("/big_withdrow/all/:page/:countPerPage", big_withdrow.findAll);

	// update a customer with customerId
	app.put("/big_withdrow/:withdrowId", big_withdrow.update);

	app.get("/shareholder/all/:page/:countPerPage", shareholder.findAll);

	app.put("/shareholder/:shareholderId", shareholder.update);

	// app.get("/top_depositor/all/:page/:countPerPage", top_depositor.findAll);
	app.get(
		"/top_depositor/all/:page/:countPerPage/:searchInput/:searchRequested",
		top_depositor.findAll
	);

	app.put("/top_depositor/:topDepositorId", top_depositor.update);

	// retrieve all dormant accounts
	// app.get("/dormants/all/:page/:countPerPage", dormant_accounts.findAll);
	app.get(
		"/dormants/all/:page/:countPerPage/:searchInput/:searchRequested",
		dormant_accounts.findAll
	);

	// update a customer with customerId
	app.put("/dormants/:withdrowId", dormant_accounts.update);

	// dormant accounts retrieve below 100 birr and their transactions inactive for two months
	// app.get(
	//   "/dormants-account-below-one-hundred/all/:page/:countPerPage",
	//   dormant_accounts_below_100.findAll
	// );
	// update a customer their transactions inactive for two months
	app.put(
		"/dormants-account-below-one-hundred/:withdrowId",
		dormant_accounts_below_100.update
	);

	app.get(
		"/dormants-account-below-one-hundred/all/:page/:countPerPage/:searchInput/:searchRequested",
		dormant_accounts_below_100.findAll
	);

	app.get("/potential_customers_distinct", potential_customer.findDistinct);
};
