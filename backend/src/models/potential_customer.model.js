const db = require("./database");

const tableName = "potential_customers";

// constructor

function PotentialCustomer(potential_customer) {
  this.company_name = potential_customer.company_name;
  this.contact_person = potential_customer.contact_person;
  this.organization_type = potential_customer.organization_type;
  this.phone = potential_customer.phone;
  this.address = potential_customer.address;

  if (potential_customer.action) {
    this.action = potential_customer.action;
    this.account_number = potential_customer.account_number;
    this.message = potential_customer.message;
  }
}

// create new potential customer
PotentialCustomer.create = (potential_customer, result) => {
  const sql = `INSERT INTO ${tableName} SET ?`;
  db.query(sql, potential_customer, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...potential_customer });
  });
};

PotentialCustomer.search = (page, countPerPage, searchInput, result) => {
  console.log("search page is " + page);
  console.log("search input is " + searchInput);
  console.log("cout per page  is " + countPerPage);
  const pageCount = page * countPerPage;
  const sql = `SELECT * FROM ${tableName} WHERE company_name LIKE ? OR organization_type LIKE ? OR contact_person LIKE ? OR phone LIKE ? OR address LIKE ?  ORDER BY id DESC LIMIT ${pageCount}, ${countPerPage}`;
  var count = `SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE company_name LIKE ? OR organization_type LIKE ? OR contact_person LIKE ? OR phone LIKE ? OR address LIKE ?`;

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

PotentialCustomer.getAll = (page, countPerPage, BOResourceLoggedIn, result) => {
  const pageCount = page * countPerPage;
  const sql = `SELECT * FROM ${tableName}  ORDER BY id DESC LIMIT ${pageCount}, ${countPerPage} `;
  var count = `SELECT COUNT(*) AS totalCount FROM ${tableName} `;
  var countTotalOpenedAccount = `SELECT COUNT(*) AS totalCount1 FROM ${tableName} WHERE action = ?`;
  var countTotalInProgress = `SELECT COUNT(*) AS totalCount2 FROM ${tableName} WHERE action = ?`;
  var countTotalNotInterested = `SELECT COUNT(*) AS totalCount3 FROM ${tableName} WHERE action = ?`;

  db.query(count, (err, resCount) => {
    if (err) {
      result(null, err);
      return;
    }

    db.query(countTotalOpenedAccount, [3], (err, countOpenedAccount) => {
      if (err) {
        result(null, err);
        return;
      }

      db.query(countTotalInProgress, [2], (err, countInprogress) => {
        if (err) {
          result(null, err);
          return;
        }

        db.query(countTotalNotInterested, [1], (err, countNotIntrested) => {
          if (err) {
            result(null, err);
            return;
          }

          var reportResult =
            "Total opend account " +
            countOpenedAccount[0].totalCount1 +
            ", in progress " +
            countInprogress[0].totalCount2 +
            ", not interested " +
            countNotIntrested[0].totalCount3 +
            ", from total of  " +
            resCount[0].totalCount +
            " potential customers";

          db.query(sql, (err, res) => {
            if (err) {
              result(null, err);
              return;
            }
            if (resCount[0].totalCount != 0) {
              if (BOResourceLoggedIn) {
                res.push({ report: reportResult });
              }
              res.push({ countRow: resCount[0].totalCount });
            }

            result(null, res);
          });
        });
      });
    });
  });
};

PotentialCustomer.getDistinct = (result) => {
  // const pageCount = page * countPerPage;
  const sql = `SELECT DISTINCT id, company_name FROM ${tableName}  where action = 3`;
  // var count = `SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE customer_branch = ?`;
  var count = `SELECT COUNT(DISTINCT company_name) AS unique_company_names_count FROM ${tableName}`;
  console.log(sql);
  db.query(count, (err, resCount) => {
    if (err) {
      result(null, err); /*  */
      return;
    }

    db.query(sql, (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      if (resCount[0].unique_company_names_count != 0) {
        res.push({ countRow: resCount[0].unique_company_names_count });
      }

      result(null, res);
      console.log(res);
    });
  });
};

PotentialCustomer.remove = (id, result) => {
  const sql = `DELETE FROM ${tableName} WHERE id = ?`;
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
PotentialCustomer.updateById = (id, data, user_id, result) => {
  const sql = `UPDATE ${tableName} SET company_name = ?, 	organization_type = ?, contact_person = ?, phone = ?, address = ? WHERE id = ?`;
  console.log(data);
  db.query(
    sql,
    [
      data.company_name,
      data.organization_type,
      data.contact_person,
      data.phone,
      data.address,
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

PotentialCustomer.updateStatusById = (
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

module.exports = PotentialCustomer;
