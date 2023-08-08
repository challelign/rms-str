const db = require("./database");

const tableName = "fcy_customer";

// constructor

function fcyCustomer(fcy_customer) {
  this.user_id = fcy_customer.user_id;
  this.branch_code = fcy_customer.branch_code;
  this.branch = fcy_customer.branch;
  this.phone = fcy_customer.phone;
  this.full_name = fcy_customer.full_name;
  this.account_number = fcy_customer.account_number;
  this.credit_amount = fcy_customer.credit_amount;
}

// create new potential customer
fcyCustomer.create = (fcy_customer, result) => {
  
  const sql = `INSERT INTO ${tableName} SET ?`;
  db.query(sql, fcy_customer, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...fcy_customer });
  });
};

fcyCustomer.search = (page, countPerPage, searchInput, branch_code, result) => {
  console.log("search page is " + page);
  console.log("search input is " + searchInput);
  console.log("cout per page  is " + countPerPage);
  const pageCount = page * countPerPage;
  const sql = `SELECT * FROM ${tableName} WHERE  (phone LIKE ? OR full_name LIKE ? OR account_number LIKE ?)   ORDER BY id DESC LIMIT ${pageCount}, ${countPerPage}`;
  var count = `SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE  (phone LIKE ? OR full_name LIKE ? OR account_number LIKE ?)`;

  db.query(count,[searchInput + "%", searchInput + "%", searchInput + "%"],
    (err, resCount) => {
      if (err) {
        result(null, err);
        return;
      }

      db.query(
        sql,
        [searchInput + "%", searchInput + "%", searchInput + "%"],
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

fcyCustomer.getAll = (page, countPerPage,BOResourceLoggedIn,branch_code, result) => {

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
fcyCustomer.remove = (id, result) => {
 
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


fcyCustomer.updateById = (id, customer,user_id,branch_code, branch, result) => {
  const sql = `UPDATE ${tableName} SET user_id = ?, 	branch_code = ?, 	branch = ?, phone = ?, full_name = ?, account_number = ?, credit_amount = ? WHERE id = ? `;
  console.log(customer);
 
  db.query(
    sql,
    [    
      user_id,
      branch_code,
      branch,
      customer.phone,
      customer.full_name,
      customer.account_number,
      customer.credit_amount,
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

      result(null, { id, ...customer});
      return;
    }
  );
};

fcyCustomer.updateStatusById = (
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

module.exports = fcyCustomer;
