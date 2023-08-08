const db = require("./database");

const tableName = "top_depositors";

// constructor

function topDepositorStatus(top_depositor_reason) {
  this.user_id = top_depositor_reason.user_id;
  this.action = top_depositor_reason.action;
  this.supplier = top_depositor_reason.supplier;
  this.customers = top_depositor_reason.customers;
  this.comment = top_depositor_reason.comment;
  this.responded = top_depositor_reason.responded;
  this.customers_full_potential_attended =
    top_depositor_reason.customers_full_potential_attended;
}

topDepositorStatus.search = (
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

// get all customers
topDepositorStatus.getAll = (
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
topDepositorStatus.updateById = (id, top_depositor_reason, user_id, result) => {
  const sql = `UPDATE ${tableName} SET user_id = ?, supplier = ?, customers = ?, customers_full_potential_attended = ?, action = ?, comment = ?, responded = ? WHERE id= ?`;
  console.log(top_depositor_reason);
  db.query(
    sql,
    [
      user_id,
      top_depositor_reason.supplier,
      top_depositor_reason.customers,
      top_depositor_reason.customers_full_potential_attended,
      top_depositor_reason.action,
      top_depositor_reason.comment,
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

      result(null, { id, ...top_depositor_reason });
    }
  );
};

module.exports = topDepositorStatus;
