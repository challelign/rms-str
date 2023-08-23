const db = require("./database");

const tableName = "logged_user";

function LoggedUser() {}

LoggedUser.create = (
	userId,
	first_name,
	last_name,
	position,
	branch_code,
	branch,
	result
) => {
	const sql = `INSERT INTO ${tableName} (user_id, name, position, branch_code, branch_name) VALUES ?`;

	var values = [
		[userId, first_name + " " + last_name, position, branch_code, branch],
	];
	db.query(sql, [values], (err, res) => {
		if (err) {
			result(err, null);
			return;
		}
	});
};
LoggedUser.search = (page, countPerPage, searchInput, result) => {
	console.log("search page is " + page);
	console.log("search input is " + searchInput);
	console.log("cout per page  is " + countPerPage);
	const pageCount = page * countPerPage;
	const sql = `SELECT * FROM ${tableName} WHERE 	name LIKE ? OR position LIKE ? OR branch_code LIKE ? OR 	branch_name LIKE ? OR 	created_at LIKE ?  ORDER BY id DESC LIMIT ${pageCount}, ${countPerPage}`;
	var count = `SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE 	name LIKE ? OR position LIKE ? OR branch_code LIKE ? OR 	branch_name LIKE ? OR 	created_at LIKE ?`;

	db.query(
		count,
		[
			searchInput + "%",
			searchInput + "%",
			searchInput + "%",
			searchInput + "%",
			searchInput + "%",
		],
		(err, resCount) => {
			if (err) {
				result(null, err);
				return;
			}

			db.query(
				sql,
				[
					searchInput + "%",
					searchInput + "%",
					searchInput + "%",
					searchInput + "%",
					searchInput + "%",
				],
				(err, res) => {
					if (err) {
						result(null, err);
						return;
					}
					if (resCount[0].totalCount != 0) {
						res.push({ countRow: resCount[0].totalCount });
					}

					result(null, res);
				}
			);
		}
	);
};

LoggedUser.getAllLeadingBranch = (
	page,
	countPerPage,
	BOResourceLoggedIn,
	result
) => {
	const pageCount = page * countPerPage;
	const sql = `SELECT id,branch_code, name, branch_name, (
  SUM( big_withdrowal_count ) + SUM( shareholder_count ) + SUM( top_depositors_count ) + SUM( dormant_account_count ) + SUM( potential_customer_count )
  ) AS Count
  FROM ${tableName}
  GROUP BY branch_code
  ORDER BY Count DESC LIMIT ${pageCount}, ${countPerPage} `;

	var count = `SELECT  COUNT(DISTINCT branch_code) AS totalCount FROM ${tableName}`;

	db.query(count, (err, resCount) => {
		if (err) {
			result(null, err);
			return;
		}
		db.query(sql, (err, res) => {
			if (err) {
				result(null, err);
				return;
			}
			if (resCount[0].totalCount != 0) {
				res.push({ countRow: resCount[0].totalCount });
			}

			result(null, res);
		});
	});
};

LoggedUser.getAllLeadingUser = (
	page,
	countPerPage,
	BOResourceLoggedIn,
	result
) => {
	const pageCount = page * countPerPage;
	const sql = `SELECT id,branch_code, name, branch_name, (
  SUM( big_withdrowal_count ) + SUM( shareholder_count ) + SUM( top_depositors_count ) + SUM( dormant_account_count ) + SUM( potential_customer_count )
  ) AS Count
  FROM ${tableName}
  GROUP BY user_id
  ORDER BY Count DESC LIMIT ${pageCount}, ${countPerPage} `;

	var count = `SELECT  COUNT(DISTINCT user_id) AS totalCount FROM ${tableName}`;

	db.query(count, (err, resCount) => {
		if (err) {
			result(null, err);
			return;
		}
		db.query(sql, (err, res) => {
			if (err) {
				result(null, err);
				return;
			}
			if (resCount[0].totalCount != 0) {
				res.push({ countRow: resCount[0].totalCount });
			}

			result(null, res);
		});
	});
};

LoggedUser.getAll = (page, countPerPage, BOResourceLoggedIn, result) => {
	const pageCount = page * countPerPage;
	const sql = `SELECT * FROM ${tableName}  ORDER BY id DESC LIMIT ${pageCount}, ${countPerPage} `;
	var count = `SELECT COUNT(*) AS totalCount FROM ${tableName} `;

	db.query(count, (err, resCount) => {
		if (err) {
			result(null, err);
			return;
		}
		db.query(sql, (err, res) => {
			if (err) {
				result(null, err);
				return;
			}
			if (resCount[0].totalCount != 0) {
				res.push({ countRow: resCount[0].totalCount });
			}

			result(null, res);
		});
	});
};

LoggedUser.update_action = (
	big_withdrowal_count,
	shareholder_count,
	top_depositors_count,
	dormant_account_count,
	potential_customer_count,
	below_500_count,
	user_id,
	result
) => {
	const sql = `UPDATE ${tableName} SET big_withdrowal_count = big_withdrowal_count + ?, shareholder_count = shareholder_count + ?, top_depositors_count = top_depositors_count + ?, dormant_account_count = dormant_account_count + ?, potential_customer_count =  potential_customer_count + ?, below_500_count =  below_500_count + ? WHERE user_id = ? ORDER BY id DESC
LIMIT 1`;
	db.query(
		sql,
		[
			big_withdrowal_count,
			shareholder_count,
			top_depositors_count,
			dormant_account_count,
			potential_customer_count,
			below_500_count,
			user_id,
		],
		(err, res) => {
			if (err) {
				result(null, err);
				return;
			} else if (res.affectedRows === 0) {
				// not found Customer with the id
				//result(null, err);
				return;
			}
		}
	);
};

module.exports = LoggedUser;
