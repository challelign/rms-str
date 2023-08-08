const FcyPayment = require("../models/fcyPayment.model");

exports.create = (req, res) => {
  if (req.session.autenticated) {
  // validate request
  if (!req.body) res.status(400).send({ message: "Content can not be empty!" });

  // create new customer
  const fcyPayment = new FcyPayment({
   
    user_id:req.session.user_id,
    paying_branch_code:req.session.branch_code,
    branch_name:req.session.branch,
    fcy_customer_id: req.body.fcy_customer_id,
    mon_transf_type: req.body.mon_transf_type,
    ref_num: req.body.ref_num,
    paid_date: req.body.paid_date,
    sender_name: req.body.sender_name,
    sender_country: req.body.sender_country,
    sender_city: req.body.sender_city,
    fcy: req.body.fcy,
    amount_in_fcy: req.body.amount_in_fcy,
    amount_in_etb: req.body.amount_in_etb,
    remark: req.body.remark,
        
  });

  // save customer in the database
  FcyPayment.create(fcyPayment,   (err, data) => {

     console.log("logged?" +req.session.autenticated); 
    //if (req.session.BOResourceLogged) {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the customer.",
        });
         else
      res.send({ message: "Customer was created successfully!", data });
    //}
  });
} else {
  res.json({ authorized: false });
  }
};

exports.FcyPayment = (req, res) => {

  if (req.session.autenticated) {
 console.log("requesting.. " );
    const { page } = req.params;
    const { countPerPage } = req.params;
    const { searchInput } = req.params;
    const { searchRequested } = req.params;
    const { fcyCustomerId } = req.params;    
    console.log("search input is " + searchRequested);
    var myBoolean =
      searchRequested === undefined || searchRequested.toLowerCase() === "false"
        ? false
        : true;
    if (myBoolean) {

      console.log("true found");
    } else {
      FcyPayment.getPayment(
        page,
        countPerPage,
        fcyCustomerId,
      
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
      FcyPayment.search(page, countPerPage, searchInput, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieve customers.",
          });

        res.send(data);
      });

      console.log("true found");
    } else {
      FcyPayment.getAll(
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
exports.delete = (req, res) => {
  if (req.session.autenticated) {
    console.log("bo resource can delete" + req.session.userCanDelete);
    const { deleteCustomerPaymentId } = req.params;
    
    FcyPayment.remove(deleteCustomerPaymentId,req.session.branch_code, (err) => {
        if (err) {
          // eslint-disable-next-line no-unused-expressions
          err.result === "not_found"
            ? res
                .status(404)
                .send({ message: `Not found shareholder with id ${deleteCustomerPaymentId}` })
            : res.status(500).send({
                message: `Could not delete shareholder with id ${deleteCustomerPaymentId}`,
              });
        }
         else
        res.send({ message: "shareholder deleted successfully!" });
      });
    
    }
 else{ res.send({ message: "unauthorized access!" });}
};
exports.update = (req, res) => {
  if (req.session.autenticated) {
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
    LoggedUser.update_action(0,0,0,0,1,req.session.user_id, (err, data) => {  });
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
