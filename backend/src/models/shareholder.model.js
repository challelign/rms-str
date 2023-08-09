const db = require("./database");

const tableName = "shareholders";

// constructor

function shareholderStatus(share_holder_reason) {
  this.user_id = share_holder_reason.user_id;
  this.action = share_holder_reason.action;
  this.reason = share_holder_reason.reason;
  this.remark = share_holder_reason.remark;
  this.efforts = share_holder_reason.efforts;
  this.responded =  share_holder_reason.responded;
}



// get single customer by id

// get all customers
shareholderStatus.getAll = ( page, countPerPage, share_holder_id, result) => {
  const pageCount = page * countPerPage;
  const sql = `SELECT * FROM ${tableName} WHERE sh_branch = ? ORDER BY id DESC  LIMIT ${pageCount}, ${countPerPage}`;
  var count = `SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE sh_branch = ?`;
  
  db.query(count,  [share_holder_id], (err, resCount) => {
    if (err) {
      result(null, err);
      return;
    }

    db.query(sql,  [share_holder_id], (err, res) => {
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
shareholderStatus.updateById = (id, share_holder_reason, user_id, result) => {
  const sql = `UPDATE ${tableName} SET user_id = ?, action = ?, reason = ?, efforts = ?, remark = ?, responded = ? WHERE id= ?`;
console.log(share_holder_reason);
  db.query(sql, [user_id, share_holder_reason.action , share_holder_reason.reason, share_holder_reason.efforts , share_holder_reason.remark, 1, id], (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows === 0) {
      // not found Customer with the id
      result({ result: "not_found" }, null);
      return;
    }

    result(null, { id, ...share_holder_reason });
  });
};




module.exports = shareholderStatus;
