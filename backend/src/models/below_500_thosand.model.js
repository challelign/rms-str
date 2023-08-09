const db = require("./database");

const tableName = "topdepositor500";

// constructor

function below500Reason(below_500_reason) {
  this.user_id = below_500_reason.user_id;
  this.response = below_500_reason.response;
  this.reasons = below_500_reason.reasons;
  this.remark = below_500_reason.remark;
  this.other_reason = below_500_reason.other_reason;
}

below500Reason.search = (
  page,
  countPerPage,
  searchInput,
  branch_code,
  result
) => {
  console.log("search page is " + page);
  console.log("search input is " + searchInput);
  console.log("cout per page  is " + countPerPage);
  console.log("branch_code  is " + branch_code);
  const pageCount = page * countPerPage;
  const sql = `SELECT * FROM ${tableName} WHERE  (customer_name LIKE ? OR account LIKE ?) AND customer_branch = ?  ORDER BY id DESC LIMIT ${pageCount}, ${countPerPage}`;
  var count = `SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE  (customer_name LIKE ? OR account LIKE ?) AND customer_branch = ?`;

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

below500Reason.getAll = (
  page,
  countPerPage,
  BOResourceLoggedIn,
  branch_code,
  result
) => {
  const pageCount = page * countPerPage;
  const sql = `SELECT * FROM ${tableName} WHERE customer_branch = ? ORDER BY id DESC LIMIT ${pageCount}, ${countPerPage}`;
  var count = `SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE customer_branch = ?`;

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
    });
  });
};

// update customers by id
below500Reason.updateById = (id, customer_reason, user_id, result) => {
  const sql = `UPDATE ${tableName} SET user_id = ?, response = ?, reason = ?, remark = ?, other_reason = ?, responded = ? WHERE id = ?`;
  console.log(customer_reason);
  db.query(
    sql,
    [
      user_id,
      customer_reason.response,
      customer_reason.reasons,
      customer_reason.remark,
      customer_reason.other_reason,
      1,
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

      result(null, { id, ...customer_reason });
    }
  );
};

module.exports = below500Reason;
