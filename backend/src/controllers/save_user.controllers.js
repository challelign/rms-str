const axios = require("axios");

const LoggedUser = require("../models/logged_user.model");

exports.login = (req, resp) => {
	console.log(req.session.branch_code);
	const { username, password } = req.body;

	axios
		.post("http://10.1.85.11/AbayERP/Webservices/wslogin", {
			username: username,
			password: password,
		})
		.then((res) => {
			console.log(res.data);
			if (res.data.message == "SUCCESS") {
				req.session.branch_code = res.data.branch_code;
				req.session.branch = res.data.branch;
				req.session.position = res.data.position;
				req.session.user_id = res.data.userid;
				if (res.data.Group.BOAdmin) {
					req.session.autenticated = true;
					req.session.BOResourceLogged = true;
					if (
						res.data.username == "Sirak Girma" ||
						res.data.username == "adugnabb" ||
						res.data.username == "abenxr" ||
						res.data.username == "haileg"
						// res.data.username == "chalie"
					) {
						req.session.userCanDelete = true;
					} else {
						req.session.userCanDelete = false;
					}
					resp.json({
						success: true,
						BOResourceLogged: true,
						IBDLogged: false,
						sessionValue: req.session,
						branch: res.data.branch,
						position: res.data.position,
					});
				} else if (res.data.branch_type == "BR") {
					req.session.autenticated = true;
					req.session.branch_code = res.data.branch_code;

					if (res.data.username != "seifed") {
						LoggedUser.create(
							res.data.userid,
							res.data.first_name,
							res.data.middle_name,
							res.data.position,
							res.data.branch_code,
							res.data.branch,
							(err, data) => {}
						);
					}
					resp.json({
						success: true,
						BOResourceLogged: false,
						IBDLogged: false,
						sessionValue: req.session,
						branch: res.data.branch,
						position: res.data.position,
					});
				} else if (res.data.Group.IBD) {
					console.log("ibd has logged");

					req.session.autenticated = true;
					req.session.IBDLogged = true;

					if (res.data.username != "seife") {
						LoggedUser.create(
							res.data.userid,
							res.data.first_name,
							res.data.middle_name,
							res.data.position,
							res.data.branch_code,
							res.data.branch,
							(err, data) => {}
						);
					}

					console.log();
					resp.json({
						success: true,
						BOResourceLogged: false,
						IBDLogged: true,
						sessionValue: req.session,
						branch: res.data.branch,
						position: res.data.position,
					});
				} else {
					resp.json({
						success: false,
						msg: "Unauthorized access, this privilege is granted for branches only!",
					});
				}
			} else {
				resp.json({ success: false, msg: "Incorrect username or password" });
			}
		})
		.catch((error) => {
			resp.json({
				success: false,
				msg: "Connection to the ERP database failed",
			});
		});
};

exports.isAutorized = (req, resp) => {
	if (req.session.autenticated) {
		console.log("Autorazation");
		resp.json({
			authorized: true,
			IBDLogged: req.session.IBDLogged,
			BOResourceLogged: req.session.BOResourceLogged,
			branch: req.session.branch,
			position: req.session.position,
			branch_code: req.session.branch_code, // this code added by chalie
		});
	} else {
		resp.json({ authorized: false });
	}
};

exports.logout = (req, resp) => {
	if (req.session.autenticated) {
		req.session.destroy();
		resp.clearCookie("expressSessionId"); // clean up!
		return resp.json({ msg: "logging you out" });
	}
};
