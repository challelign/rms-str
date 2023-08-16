const db = require("./database");

const tableName = "str_list";
// constructor

function strList(str_list) {
  this.user_id = str_list.user_id;
  this.customer_branch = str_list.customer_branch;
  this.branch = str_list.branch;
  this.customer_id = str_list.customer_id;
  this.customer_name = str_list.customer_name;
  this.account_number = str_list.account_number;
  this.transaction_id = str_list.transaction_id;
  this.reason = str_list.reason;
  this.address = str_list.address;
  this.file_name = str_list.file_name;
}

// create new potential customer

strList.create = (str_list, result) => {
  const sql = `INSERT INTO ${tableName} SET ?`;
  db.query(sql, str_list, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...str_list });
  });
};

strList.search = (page, countPerPage, searchInput, branch_code, result) => {
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

strList.getAll = (
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

strList.remove = (id, result) => {
  const sql = `DELETE FROM ${tableName} WHERE id = ?  `;
  db.query(sql, id, branch_code, (err, res) => {
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

strList.updateById = (
  id,
  customer,
  user_id,
  customer_branch,
  branch,
  result
) => {
  const sql = `UPDATE ${tableName} SET user_id = ?,customer_branch = ?,branch = ?, customer_name = ?,  customer_id = ?, account_number = ?,transaction_id=?,reason=?,address=? WHERE id = ? `;
  console.log("customer log from front sql ", customer);

  db.query(
    sql,
    [
      user_id,
      customer_branch,
      branch,
      customer.customer_name,
      customer.account_id,
      customer.account_number,
      customer.transaction_id,
      customer.reason,
      customer.address,
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

strList.updateFileById = (id, file_name, result) => {
  const sql = `SELECT file_name FROM ${tableName} WHERE id = ? `;
  con.query(sql, function (err, result) {
    if (err) result(null, err);
    console.log(result);
  });
  // const sql2 = `UPDATE ${tableName} SET file_name = ? WHERE id = ? `;
  // db.query(sql2, [file_name, id], (err, res) => {
  //   if (err) {
  //     result(null, err);
  //     return;
  //   }

  //   if (res.affectedRows === 0) {
  //     // not found Customer with the id
  //     result({ result: "not_found" }, null);
  //     return;
  //   }

  //   result(null, { id, file_name });
  // });
};

module.exports = strList;
