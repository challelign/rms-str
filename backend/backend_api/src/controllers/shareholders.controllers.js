const shareholderStatus = require("../models/shareholder.model");

const LoggedUser = require("../models/logged_user.model");


// retrieve all customers from the database
exports.findAll = (req, res) => {
  if (req.session.autenticated) {
  const { page } = req.params;
  const { countPerPage } = req.params;
 // const { perPageCount } = req.params;
 shareholderStatus.getAll(page, countPerPage, req.session.branch_code , (err, data) => {
    if (err) res.status(500).send({ message: err.message || "Some error occurred while retrieve customers." });

    res.send(data);
  });

}

else {  res.json({ authorized: false  }); }
};




// update a cutomer identified by the customerId in the request
exports.update = (req, res) => {
  if (req.session.autenticated) {
  // validate request
  if (!req.body) res.status(400).send({ message: "Content can not be empty!" });

  const { shareholderId } = req.params;
  const reason = new shareholderStatus(req.body);
LoggedUser.update_action(0,1,0,0,0,0,req.session.user_id, (err, data) => {  });
  shareholderStatus.updateById(shareholderId, reason, req.session.user_id, (err, data) => {
    if (err) {
      // eslint-disable-next-line no-unused-expressions
      err.result === "not_found"
        ? res.status(404).send({ message: `Not found customer with id ${withdrowId}` })
        : res.status(500).send({ message: `Could not update customer with id ${withdrowId}` });
    }

    res.send({ message: "Customer was updating successfully!", data });
  });
}

else {  res.json({ authorized: false  }); }
};
