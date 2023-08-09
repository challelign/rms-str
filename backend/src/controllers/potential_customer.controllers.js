const PotentialCustomer = require("../models/potential_customer.model");
const LoggedUser = require("../models/logged_user.model");
exports.create = (req, res) => {
  // validate request
  if (!req.body) res.status(400).send({ message: "Content can not be empty!" });

  // create new customer
  const potential_customer = new PotentialCustomer({
    company_name: req.body.company_name,
    contact_person: req.body.contact_person,
    organization_type: req.body.organization_type,
    phone: req.body.phone,
    address: req.body.address,
  });

  // save customer in the database
  PotentialCustomer.create(potential_customer, (err, data) => {
    if (req.session.BOResourceLogged) {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the customer.",
        });

      res.send({ message: "Customer was created successfully!", data });
    }
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
      PotentialCustomer.search(page, countPerPage, searchInput, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieve customers.",
          });

        res.send(data);
      });

      console.log("true found");
    } else {
      PotentialCustomer.getAll(
        page,
        countPerPage,
        BOResourceLoggedIn,
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
  } else {
    res.json({ authorized: false });
  }
};

exports.findDistinct = (req, res) => {
  if (req.session.autenticated) {
    // const { page } = req.params;
    // const { countPerPage } = req.params;
    // const { perPageCount } = req.params;
    PotentialCustomer.getDistinct(
      // page,
      // countPerPage,
      // req.session.branch_code,
      (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieve customers.",
          });

        res.send(data);
        // alert("Data is: " + page);
      }
    );
  } else {
    res.json({ authorized: false });
  }
};

exports.delete = (req, res) => {
  if (req.session.BOResourceLogged) {
    console.log("bo resource can delete" + req.session.userCanDelete);
    const { customerId } = req.params;
    if (req.session.userCanDelete) {
      PotentialCustomer.remove(customerId, (err) => {
        if (err) {
          // eslint-disable-next-line no-unused-expressions
          err.result === "not_found"
            ? res
                .status(404)
                .send({ message: `Not found customer with id ${customerId}` })
            : res.status(500).send({
                message: `Could not delete customer with id ${customerId}`,
              });
        }

        res.send({ message: "Potential Customer  deleted successfully!" });
      });
    } else {
      res.send({ message: "unauthorized access!" });
    }
  } else {
    res.send({ message: "unauthorized access!" });
  }
};
exports.update = (req, res) => {
  if (req.session.BOResourceLogged) {
    // validate request
    if (!req.body)
      res.status(400).send({ message: "Content can not be empty!" });

    const { customerId } = req.params;
    const data = new PotentialCustomer(req.body);

    PotentialCustomer.updateById(
      customerId,
      data,
      req.session.user_id,
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
exports.updateStatus = (req, res) => {
  if (req.session.autenticated) {
    // validate request
    if (!req.body)
      res.status(400).send({ message: "Content can not be empty!" });

    const { customerId } = req.params;
    const data = new PotentialCustomer(req.body);
    console.log(data);
    LoggedUser.update_action(
      0,
      0,
      0,
      0,
      1,
      0,
      req.session.user_id,
      (err, data) => {}
    );
    PotentialCustomer.updateStatusById(
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
