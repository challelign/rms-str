const below500Reason = require("../models/below_500_thosand.model");
const LoggedUser = require("../models/logged_user.model");

// exports.findAll = (req, res) => {
//   if (req.session.autenticated) {
//   const { page } = req.params;
//   const { countPerPage } = req.params;
//  // const { perPageCount } = req.params;
//  below500Reason.getAll(page, countPerPage, req.session.branch_code ,  (err, data) => {
//     if (err) res.status(500).send({ message: err.message || "Some error occurred while retrieve customers." });

//     res.send(data);
//     // alert("Data is: " + page);
//   });
// }

// else {  res.json({ authorized: false  }); }
// };
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
			below500Reason.search(
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
			below500Reason.getAll(
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

// update a cutomer identified by the customerId in the request
exports.update = (req, res) => {
	if (req.session.autenticated) {
		// validate request
		if (!req.body)
			res.status(400).send({ message: "Content can not be empty!" });

		const { reportId } = req.params;
		const reason = new below500Reason(req.body);

		LoggedUser.update_action(
			0,
			0,
			0,
			0,
			0,
			1,
			req.session.user_id,
			(err, data) => {}
		);
		below500Reason.updateById(
			reportId,
			reason,
			req.session.user_id,
			(err, data) => {
				if (err) {
					// eslint-disable-next-line no-unused-expressions
					err.result === "not_found"
						? res
								.status(404)
								.send({ message: `Not found customer with id ${reportId}` })
						: res.status(500).send({
								message: `Could not update customer with id ${reportId}`,
						  });
				}

				res.send({ message: "Data updated successfully!", data });
			}
		);
	} else {
		res.json({ authorized: false });
	}
};
