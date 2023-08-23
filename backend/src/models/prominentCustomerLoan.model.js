const db = require("./database");

const tableName = "prominent_customer";

const tableName2 = "potential_customers";
// constructor

function prominentCustomerLoan(prominent_customer) {
	this.user_id = prominent_customer.user_id;
	this.branch_code = prominent_customer.branch_code;
	this.branch = prominent_customer.branch;
	this.company_name = prominent_customer.company_name;
	this.account_number = prominent_customer.account_number;
}

// create new potential customer
prominentCustomerLoan.create = (prominent_customer, result) => {
	const sql = `INSERT INTO ${tableName} SET ?`;
	db.query(sql, prominent_customer, (err, res) => {
		if (err) {
			result(err, null);
			return;
		}

		result(null, { id: res.insertId, ...prominent_customer });
	});
};

prominentCustomerLoan.search = (
	page,
	countPerPage,
	searchInput,
	branch_code,
	result
) => {
	console.log("search page is " + page);
	console.log("search input is " + searchInput);
	console.log("cout per page  is " + countPerPage);
	const pageCount = page * countPerPage;

	const sql = `SELECT ${tableName}.id,
                    ${tableName}.account_number,
                    ${tableName2}.company_name ,
                    ${tableName}.company_name as prominent_potential_customers_id,
                    ${tableName2}.id as potential_id
                  FROM ${tableName}, ${tableName2}
                  WHERE  ( ${tableName2}.company_name LIKE ?  OR ${tableName}.account_number LIKE ?)
                  AND ${tableName}.company_name = ${tableName2}.id
                  AND ${tableName}.branch_code = ?
                  AND ${tableName2}.action = 3
                  ORDER BY ${tableName}.id DESC
                  LIMIT ${pageCount}, ${countPerPage}`;

	// const sql = `SELECT *
	//             FROM ${tableName}
	//             INNER JOIN ${tableName2}
	//             ON ${tableName}.company_name = ${tableName2}.id
	//             WHERE   (${tableName}.account_number LIKE ?  OR ${tableName2}.company_name LIKE ?)
	//             AND ${tableName}.branch_code = ?
	//             AND   ${tableName2}.action = 3
	//             ORDER BY  ${tableName}.id DESC
	//             LIMIT ${pageCount}, ${countPerPage}`;

	// const sql = `SELECT * FROM ${tableName}, ${tableName2} WHERE   (${tableName2}.company_name LIKE ? OR ${tableName}.account_number LIKE ?)  AND branch_code = ?  ORDER BY id DESC LIMIT ${pageCount}, ${countPerPage}`;

	const count = `SELECT COUNT(*) AS totalCount
                    FROM ${tableName}
                    INNER JOIN ${tableName2}
                    ON ${tableName}.company_name = ${tableName2}.id
                    WHERE  (${tableName2}.company_name LIKE ? OR ${tableName}.account_number LIKE ?) AND   ${tableName2}.action = 3 AND ${tableName}.branch_code = ?`;
	// const sql = `SELECT * FROM ${tableName} WHERE  (company_name LIKE ? OR account_number LIKE ?) AND branch_code = ?  ORDER BY id DESC LIMIT ${pageCount}, ${countPerPage}`;
	// var count = `SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE  (company_name LIKE ? OR account_number LIKE ?) AND branch_code = ?`;

	db.query(
		count,
		[searchInput + "%", searchInput + "%", branch_code],
		(err, resCount) => {
			if (err) {
				result(null, err);
				return;
			}

			db.query(
				sql,
				[searchInput + "%", searchInput + "%", branch_code],
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

prominentCustomerLoan.getAll = (
	page,
	countPerPage,
	BOResourceLoggedIn,
	branch_code,
	result
) => {
	const pageCount = page * countPerPage;

	// const sql = `SELECT ${tableName}.id  ,
	//             ${tableName}.account_number ,
	//             ${tableName}.company_name
	//             ${tableName2}.id,
	//             ${tableName2}.company_name,
	//             ${tableName2}.action
	//            FROM ${tableName} , ${tableName2}
	//            WHERE ${tableName}.company_name = ${tableName2}.id AND  ${tableName}.branch_code = ? AND   ${tableName2}.action = 3
	//            ORDER BY  ${tableName}.id DESC
	//            LIMIT ${pageCount}, ${countPerPage}`;

	const sql = `SELECT ${tableName}.id, 
                    ${tableName}.account_number, 
                    ${tableName2}.company_name, 
                    ${tableName}.company_name as prominent_potential_customers_id, 
                    ${tableName2}.id as potential_id
             FROM ${tableName}, ${tableName2}
             WHERE ${tableName}.company_name = ${tableName2}.id
               AND ${tableName}.branch_code = ?
               AND ${tableName2}.action = 3
             ORDER BY ${tableName}.id DESC
             LIMIT ${pageCount}, ${countPerPage}`;

	// const sql = `SELECT *
	//            FROM ${tableName}
	//            INNER JOIN ${tableName2}
	//            ON ${tableName}.company_name = ${tableName2}.id
	//            WHERE  ${tableName}.branch_code = ? AND   ${tableName2}.action = 3
	//            ORDER BY  ${tableName}.id DESC
	//            LIMIT ${pageCount}, ${countPerPage}`;

	const count = `SELECT COUNT(*) AS totalCount
                    FROM ${tableName}
                    INNER JOIN ${tableName2}
                    ON ${tableName}.company_name = ${tableName2}.id
                    WHERE    ${tableName2}.action = 3 AND ${tableName}.branch_code = ?`;

	// const sql = `SELECT * FROM ${tableName} WHERE branch_code = ?   ORDER BY id DESC LIMIT ${pageCount}, ${countPerPage} `;
	// var count = `SELECT COUNT(*) AS totalCount FROM ${tableName}  WHERE branch_code = ? `;

	db.query(count, [branch_code], (err, resCount) => {
		if (err) {
			result(null, err);
			return;
		}
		db.query(sql, [branch_code], (err, res) => {
			if (err) {
				result(null, err);
				return;
			}
			if (resCount[0].totalCount != 0) {
				res.push({ countRow: resCount[0].totalCount });
			}

			result(null, res);

			console.log("result log is =>", res);
		});
	});
};
prominentCustomerLoan.remove = (id, result) => {
	const sql = `DELETE FROM ${tableName} WHERE id = ?  `;
	db.query(sql, id, (err, res) => {
		if (err) {
			result(null, err);
			return;
		}

		if (res.affectedRows === 0) {
			result({ result: "not_found" }, null);
			return;
		}

		result(null, res);
	});
};

prominentCustomerLoan.updateById = (
	id,
	customer,
	user_id,
	branch_code,
	branch,
	result
) => {
	const sql = `UPDATE ${tableName} SET user_id = ?, 	branch_code = ?, 	branch = ?, company_name = ?,  account_number = ?  WHERE id = ? `;
	console.log("customer log from front sql ", customer);

	db.query(
		sql,
		[
			user_id,
			branch_code,
			branch,
			customer.company_name,
			customer.account_number,
			id,
		],

		(err, res) => {
			if (err) {
				result(null, err);
				return;
			}

			if (res.affectedRows === 0) {
				// not found Customer with the id
				result({ result: "not_found" }, null);
				return;
			}

			result(null, { id, ...customer });
			console.log("update result is", customer);
			return;
		}
	);
};

prominentCustomerLoan.updateStatusById = (
	id,
	data,
	user_id,
	branch_code,
	branch,
	result
) => {
	const sql = `UPDATE ${tableName} SET user_id = ?, branch_code = ?, branch = ?, action = ?, 	account_number = ?, message = ? WHERE id = ? `;
	console.log(data);
	db.query(
		sql,
		[
			user_id,
			branch_code,
			branch,
			data.action,
			data.account_number,
			data.message,
			id,
		],
		(err, res) => {
			if (err) {
				result(null, err);
				return;
			}

			if (res.affectedRows === 0) {
				// not found Customer with the id
				result({ result: "not_found" }, null);
				return;
			}

			result(null, { id, ...data });
		}
	);
};

module.exports = prominentCustomerLoan;
