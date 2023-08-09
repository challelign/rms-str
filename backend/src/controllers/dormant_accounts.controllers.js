const dormantAccountReason = require("../models/dormant_accounts.model");
const LoggedUser = require("../models/logged_user.model");

// exports.findAll = (req, res) => {
//   if (req.session.autenticated) {
//   const { page } = req.params;
//   const { countPerPage } = req.params;
//  // const { perPageCount } = req.params;
//   dormantAccountReason.getAll(page, countPerPage, req.session.branch_code ,  (err, data) => {
//     if (err) res.status(500).send({ message: err.message || "Some error occurred while retrieve customers." });

//     res.send(data);
//     // alert("Data is: " + page);
//   });
// }

// else {  res.json({ authorized: false  }); }
// };

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
      dormantAccountReason.search(
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
      dormantAccountReason.getAll(
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

// update a cutomer identified by the customerId in the request
exports.update = (req, res) => {
  if (req.session.autenticated) {
    // validate request
    if (!req.body)
      res.status(400).send({ message: "Content can not be empty!" });

    const { withdrowId } = req.params;
    const reason = new dormantAccountReason(req.body);

    LoggedUser.update_action(
      0,
      0,
      0,
      1,
      0,
      0,
      req.session.user_id,
      (err, data) => {}
    );
    dormantAccountReason.updateById(
      withdrowId,
      reason,
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
