const Str_List = require("../models/str.model");

exports.create = (req, res) => {
  // validate request
  if (!req.body) res.status(400).send({ message: "Content can not be empty!" });

  // create new customer
  const str_list = new Str_List({
    user_id: req.session.user_id,
    customer_branch: req.session.branch_code,
    branch: req.session.branch,
    customer_id: req.body.customer_id,
    customer_name: req.body.customer_name,
    account_number: req.body.account_number,
    transaction_id: req.body.transaction_id,
    reason: req.body.reason,
    address: req.body.address,
  });

  // save customer in the database
  Str_List.create(str_list, (err, data) => {
    //if (req.session.BOResourceLogged) {

    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the customer.",
      });
    else res.send({ message: "Customer was created successfully!", data });
    //}
  });
};

exports.findAll = (req, res) => {
  if (req.session.autenticated) {
    if (req.session.BOResourceLogged) {
      var BOResourceLoggedIn = true;
    } else {
      var BOResourceLoggedIn = false;
    }

    const { page } = req.params;
    const { countPerPage } = req.params;
    const { searchInput } = req.params;
    const { searchRequested } = req.params;

    console.log("search input is " + searchRequested);
    var myBoolean =
      searchRequested === undefined || searchRequested.toLowerCase() === "false"
        ? false
        : true;
    if (myBoolean) {
      Str_List.search(
        page,
        countPerPage,
        searchInput,
        req.session.branch_code,
        (err, data) => {
          if (err)
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieve customers.",
            });

          res.send(data);
        }
      );

      console.log("true found");
    } else {
      Str_List.getAll(
        page,
        countPerPage,
        BOResourceLoggedIn,
        req.session.branch_code,
        (err, data) => {
          if (err)
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieve customers.",
            });

          res.send(data);
          console.log("false found");
        }
      );
    }
    // } else {
    //  res.json({ authorized: false });
    // }
  } else {
    res.json({ authorized: false });
  }
};

exports.delete = (req, res) => {
  if (req.session.autenticated) {
    console.log("bo resource can delete" + req.session.userCanDelete);
    const { fcyCustomerId } = req.params;

    Str_List.remove(fcyCustomerId, (err) => {
      if (err) {
        err.result === "not_found"
          ? res
              .status(404)
              .send({ message: `Not found customer with id ${fcyCustomerId}` })
          : res.status(500).send({
              message: `Could not delete customer with id ${fcyCustomerId}`,
            });
      } else res.send({ message: "FCY Customer  deleted successfully!" });
    });
  } else {
    res.json({ authorized: false });
  }
  // else{ res.send({ message: "unauthorized access!" });}
};

exports.updateCustomer = (req, res) => {
  if (req.session.autenticated) {
    console.log("called");
    // validate request

    console.log("req.body data is from the backend", req.body);
    if (!req.body)
      res.status(400).send({ message: "Content can not be empty!" });

    const { customerId } = req.params;
    const data = new Str_List(req.body);
    console.log(data);
    //LoggedUser.update_action(0,0,0,0,1,req.session.user_id, (err, data) => {  });
    Str_List.updateById(
      customerId,
      data,
      req.session.user_id,
      req.session.branch_code,
      req.session.branch,
      (err, data) => {
        if (err) {
          // eslint-disable-next-line no-unused-expressions
          err.result === "not_found"
            ? res
                .status(404)
                .send({ message: `Not found customer with id ${customerId}` })
            : res.status(500).send({
                message: `Could not update customer with id ${customerId}`,
              });
        } else
          res.send({ message: "Customer data updated successfully!", data });
      }
    );
  } else {
    res.json({ authorized: false });
  }
};

exports.updateStatus = (req, res) => {
  if (req.session.branchLogged) {
    // validate request
    if (!req.body)
      res.status(400).send({ message: "Content can not be empty!" });

    const { customerId } = req.params;
    const data = new Str_List(req.body);
    console.log(data);
    LoggedUser.update_action(
      0,
      0,
      0,
      0,
      1,
      req.session.user_id,
      (err, data) => {}
    );
    Str_List.updateById(
      customerId,
      data,
      req.session.user_id,
      req.session.branch_code,
      req.session.branch,
      (err, data) => {
        if (err) {
          // eslint-disable-next-line no-unused-expressions
          err.result === "not_found"
            ? res
                .status(404)
                .send({ message: `Not found customer with id ${withdrowId}` })
            : res.status(500).send({
                message: `Could not update customer with id ${withdrowId}`,
              });
        }

        res.send({ message: "Customer was updating successfully!", data });
      }
    );
  } else {
    res.json({ authorized: false });
  }
};
