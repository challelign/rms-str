const db = require("./database");

const tableName = "fcy_customer_transaction";

// constructor

function FcyPayment(payment) {
  this.user_id=payment.user_id,
  this.paying_branch_code=payment.paying_branch_code,
  this.branch_name=payment.branch_name,
  this.fcy_customer_id=payment.fcy_customer_id,
  this.mon_transf_type=payment.mon_transf_type,
  this.ref_num=payment.ref_num,
  this.paid_date=payment.paid_date,
  this.sender_name=payment.sender_name,
  this.sender_country=payment.sender_country,
  this.sender_city=payment.sender_city,
  this.fcy=payment.fcy,
  this.amount_in_fcy= payment.amount_in_fcy,
  this.amount_in_etb= payment.amount_in_etb,
  this.remark=payment.remark
}

// create new potential customer
FcyPayment.create = (payment, result) => {
  console.log(payment);
  const sql = `INSERT INTO ${tableName} SET ?`;
  db.query(sql, payment, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...payment });
  });
};

FcyPayment.getPayment = (page, countPerPage,fcyCustomerId,result) => {
  const pageCount = page * countPerPage;
  const sql = `SELECT * FROM ${tableName} WHERE fcy_customer_id=${fcyCustomerId} ORDER BY id DESC LIMIT ${pageCount}, ${countPerPage} `;
  var count = `SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE fcy_customer_id=${fcyCustomerId}`;

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
FcyPayment.search = (page, countPerPage, searchInput, result) => {
  console.log("search page is " + page);
  console.log("search input is " + searchInput);
  console.log("cout per page  is " + countPerPage);
  const pageCount = page * countPerPage;
  const sql = `SELECT * FROM ${tableName} WHERE paying_branch_code	 LIKE ? OR branch_name LIKE ? OR mon_transf_type LIKE ? OR ref_num LIKE ? OR paid_date LIKE ? OR paid_date LIKE ? OR sender_name LIKE ? OR sender_country LIKE ?  OR sender_city LIKE ?  OR fcy LIKE ? OR amount_in_fcy LIKE ? OR amount_in_etb LIKE ?  OR remark LIKE ? ORDER BY id DESC LIMIT ${pageCount}, ${countPerPage}`;
  var count = `SELECT COUNT(*) AS totalCount FROM ${tableName}  WHERE paying_branch_code	LIKE ? OR branch_name LIKE ? OR mon_transf_type LIKE ? OR ref_num LIKE ? OR paid_date LIKE ? OR paid_date LIKE ? OR sender_name LIKE ? OR sender_country LIKE ?  OR sender_city LIKE ?  OR fcy LIKE ? OR amount_in_fcy LIKE ? OR amount_in_etb LIKE ?  OR remark LIKE ?`;
  db.query(
    count,
    [
      searchInput + "%",
      searchInput + "%",
      searchInput + "%",
      searchInput + "%",
      searchInput + "%",
      searchInput + "%",
      searchInput + "%",
      searchInput + "%",
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
          searchInput + "%",
          searchInput + "%",
          searchInput + "%",
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

FcyPayment.getAll = (page, countPerPage,BOResourceLoggedIn, result) => {
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
FcyPayment.remove = (id, result) => {
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
FcyPayment.updateById = (id, data, user_id, result) => {
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

FcyPayment.updateStatusById = (
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

module.exports = FcyPayment;
