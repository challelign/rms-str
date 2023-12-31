const FcyCustomer = require("../models/fcyCustomer.model");

exports.create = (req, res) => {
	// validate request
	if (!req.body) res.status(400).send({ message: "Content can not be empty!" });

	// create new customer
	const fcyCustomer = new FcyCustomer({
		user_id: req.session.user_id,
		branch_code: req.session.branch_code,
		branch: req.session.branch,
		phone: req.body.phone,
		full_name: req.body.full_name,
		account_number: req.body.account_number,
		credit_amount: req.body.credit_amount,
	});

	// save customer in the database
	FcyCustomer.create(fcyCustomer, (err, data) => {
		//if (req.session.BOResourceLogged) {
		if (err)
			res.status(500).send({
				message:
					err.message || "Some error occurred while creating the customer.",
			});
		else res.send({ message: "Customer was created successfully!", data });
		//}
	});
};
exports.findAll = (req, res) => {
	if (req.session.autenticated) {
		if (req.session.BOResourceLogged) {
			var BOResourceLoggedIn = true;
		} else {
			var BOResourceLoggedIn = false;
		}

		const { page } = req.params;
		const { countPerPage } = req.params;
		const { searchInput } = req.params;
		const { searchRequested } = req.params;

		console.log("search input is " + searchRequested);
		var myBoolean =
			searchRequested === undefined || searchRequested.toLowerCase() === "false"
				? false
				: true;
		if (myBoolean) {
			FcyCustomer.search(
				page,
				countPerPage,
				searchInput,
				req.session.branch_code,
				(err, data) => {
					if (err)
						res.status(500).send({
							message:
								err.message || "Some error occurred while retrieve customers.",
						});

					res.send(data);
				}
			);

			console.log("true found");
		} else {
			FcyCustomer.getAll(
				page,
				countPerPage,
				BOResourceLoggedIn,
				req.session.branch_code,
				(err, data) => {
					if (err)
						res.status(500).send({
							message:
								err.message || "Some error occurred while retrieve customers.",
						});

					res.send(data);
					console.log("false found");
				}
			);
		}
		// } else {
		//  res.json({ authorized: false });
		// }
	} else {
		res.json({ authorized: false });
	}
};
exports.delete = (req, res) => {
	if (req.session.autenticated) {
		console.log("bo resource can delete" + req.session.userCanDelete);
		const { fcyCustomerId } = req.params;

		FcyCustomer.remove(fcyCustomerId, (err) => {
			if (err) {
				err.result === "not_found"
					? res
							.status(404)
							.send({ message: `Not found customer with id ${fcyCustomerId}` })
					: res.status(500).send({
							message: `Could not delete customer with id ${fcyCustomerId}`,
					  });
			} else res.send({ message: "FCY Customer  deleted successfully!" });
		});
	} else {
		res.json({ authorized: false });
	}
	// else{ res.send({ message: "unauthorized access!" });}
};
exports.updateCustomer = (req, res) => {
	if (req.session.autenticated) {
		console.log("called");
		// validate request
		if (!req.body)
			res.status(400).send({ message: "Content can not be empty!" });

		const { customerId } = req.params;
		const data = new FcyCustomer(req.body);
		console.log(data);
		//LoggedUser.update_action(0,0,0,0,1,req.session.user_id, (err, data) => {  });
		FcyCustomer.updateById(
			customerId,
			data,
			req.session.user_id,
			req.session.branch_code,
			req.session.branch,
			(err, data) => {
				if (err) {
					// eslint-disable-next-line no-unused-expressions
					err.result === "not_found"
						? res
								.status(404)
								.send({ message: `Not found customer with id ${customerId}` })
						: res.status(500).send({
								message: `Could not update customer with id ${customerId}`,
						  });
				} else
					res.send({ message: "Customer data updated successfully!", data });
			}
		);
	} else {
		res.json({ authorized: false });
	}
};
exports.updateStatus = (req, res) => {
	if (req.session.branchLogged) {
		// validate request
		if (!req.body)
			res.status(400).send({ message: "Content can not be empty!" });

		const { customerId } = req.params;
		const data = new PotentialCustomer(req.body);
		console.log(data);
		LoggedUser.update_action(
			0,
			0,
			0,
			0,
			1,
			req.session.user_id,
			(err, data) => {}
		);
		PotentialCustomer.updateById(
			customerId,
			data,
			req.session.user_id,
			req.session.branch_code,
			req.session.branch,
			(err, data) => {
				if (err) {
					// eslint-disable-next-line no-unused-expressions
					err.result === "not_found"
						? res
								.status(404)
								.send({ message: `Not found customer with id ${withdrowId}` })
						: res.status(500).send({
								message: `Could not update customer with id ${withdrowId}`,
						  });
				}

				res.send({ message: "Customer was updating successfully!", data });
			}
		);
	} else {
		res.json({ authorized: false });
	}
};
