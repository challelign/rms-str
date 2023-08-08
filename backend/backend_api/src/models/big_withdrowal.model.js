const db = require("./database");

const tableName = "big_withdrawal";

// constructor

function bigWithdrowReason(big_withdrow_reason) {
  this.user_id = big_withdrow_reason.user_id;
  //this.customer_branch = big_withdrow_reason.customer_branch;
  this.status_response = big_withdrow_reason.status_response;
  this.response_time = big_withdrow_reason.response_time;
  this.action = big_withdrow_reason.action;
  this.customer_reason = big_withdrow_reason.customer_reason;
  this.destination_bank = big_withdrow_reason.destination_bank;
  this.destination_branch = big_withdrow_reason.destination_branch;
  this.remark = big_withdrow_reason.remark;
  this.account_holder = big_withdrow_reason.account_holder;
  this.beneficiary_name = big_withdrow_reason.beneficiary_name;
}


bigWithdrowReason.getAll = (page, countPerPage, branch_code, result) => {
  console.log("branch codeeee" + branch_code);
  const pageCount = page * countPerPage;
  const sql = `SELECT * FROM ${tableName} WHERE customer_branch = ? ORDER BY id DESC LIMIT ${pageCount}, ${countPerPage}  `;
  var count = `SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE customer_branch = ? `;

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
bigWithdrowReason.updateById = (id, customer_reason, user_id, result) => {
  const sql = `UPDATE ${tableName} SET user_id = ?, status_response = ?, action = ?, customer_reason = ?, destination_bank = ?, destination_branch = ?, remark = ?, account_holder = ?, beneficiary_name = ? WHERE id= ?`;
  console.log(customer_reason);
  console.log("user id is " + user_id);
  db.query(
    sql,
    [
      user_id,
      1,
      customer_reason.action,
      customer_reason.customer_reason,
      customer_reason.destination_bank,
      customer_reason.destination_branch,
      customer_reason.remark,
      customer_reason.account_holder,
      customer_reason.beneficiary_name,
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



module.exports = bigWithdrowReason;
