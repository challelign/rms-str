const db = require("./database");

const tableName = "dormant_accounts";

// constructor

function dormantAccountReason(dormant_accounts_reason) {
  this.user_id = dormant_accounts_reason.user_id;
  this.action = dormant_accounts_reason.action;
  this.reasons = dormant_accounts_reason.reasons;
  this.remark = dormant_accounts_reason.remark;
  this.other_reason = dormant_accounts_reason.other_reason;
}

dormantAccountReason.search = (
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
  const sql = `SELECT * FROM ${tableName} WHERE  (customer_name LIKE ? OR account_number LIKE ?) AND customer_branch = ?  ORDER BY id DESC LIMIT ${pageCount}, ${countPerPage}`;
  var count = `SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE  (customer_name LIKE ? OR account_number LIKE ?) AND customer_branch = ?`;

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

dormantAccountReason.getAll = (
  page,
  countPerPage,
  BOResourceLoggedIn,
  branch_code,
  result
) => {
  const pageCount = page * countPerPage;
  const sql = `SELECT * FROM ${tableName} WHERE customer_branch = ? ORDER BY id DESC LIMIT ${pageCount}, ${countPerPage}`;
  var count = `SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE customer_branch = ?`;
  console.log(sql);
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
      console.log(res);
    });
  });
};

// update customers by id
dormantAccountReason.updateById = (id, customer_reason, user_id, result) => {
  const sql = `UPDATE ${tableName} SET user_ID = ?, action = ?, reason = ?, remark = ?, other_reason = ?, responded = ? WHERE id = ?`;
  console.log(customer_reason);
  db.query(
    sql,
    [
      user_id,
      customer_reason.action,
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

module.exports = dormantAccountReason;
