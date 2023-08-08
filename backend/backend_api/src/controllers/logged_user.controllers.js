const LoggedUser = require("../models/logged_user.model");
exports.findAll = (req, res) => {
  if (req.session.BOResourceLogged) {
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
      LoggedUser.search(page, countPerPage, searchInput, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieve customers.",
          });

        res.send(data);
      });

      console.log("true found");
    } else {
      LoggedUser.getAll(
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

exports.findLeadingBranchAll = (req, res) => {
  if (req.session.BOResourceLogged) {
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

      console.log("true found");
    } else {
      LoggedUser.getAllLeadingBranch(
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
exports.findLeadingUserAll = (req, res) => {
  if (req.session.BOResourceLogged) {
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



      console.log("true found");
    } else {
      LoggedUser.getAllLeadingUser(
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
