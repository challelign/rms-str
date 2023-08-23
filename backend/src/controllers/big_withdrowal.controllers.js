const bigWithdrowReason = require("../models/big_withdrowal.model");
const LoggedUser = require("../models/logged_user.model");
// retrieve all customers from the database
exports.findAll = (req, res) => {
	if (req.session.autenticated) {
		const { page } = req.params;
		const { countPerPage } = req.params;
		// const { perPageCount } = req.params;
		bigWithdrowReason.getAll(
			page,
			countPerPage,
			req.session.branch_code,
			(err, data) => {
				if (err)
					res
						.status(500)
						.send({
							message:
								err.message || "Some error occurred while retrieve customers.",
						});

				res.send(data);
			}
		);
	} else {
		res.json({ authorized: false });
	}
};

// find a single customer with the customerId

// update a cutomer identified by the customerId in the request
exports.update = (req, res) => {
	if (req.session.autenticated) {
		// validate request
		if (!req.body)
			res.status(400).send({ message: "Content can not be empty!" });

		const { withdrowId } = req.params;
		const reason = new bigWithdrowReason(req.body);

		bigWithdrowReason.updateById(
			withdrowId,
			reason,
			req.session.user_id,
			(err, data) => {
				LoggedUser.update_action(
					1,
					0,
					0,
					0,
					0,
					0,
					req.session.user_id,
					(err, data) => {}
				);
				if (err) {
					// eslint-disable-next-line no-unused-expressions
					err.result === "not_found"
						? res
								.status(404)
								.send({ message: `Not found customer with id ${withdrowId}` })
						: res
								.status(500)
								.send({
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
