const Str_List = require("../models/str.model");
const file = require("../utils/file");

// exports.uploads = (req, res) => {
//   file.upload(req, res, (err) => {
//     if (err) {
//       return res.status(500).json({
//         status: "FAILURE",
//         message: "Error uploading files",
//       });
//     }
//     const files = req.files;
//     res.status(200).json({
//       status: "SUCCESS",
//       message: "Files uploaded successfully",
//       fileCount: files.length,
//     });
//   });
// };

// exports.deleteFile = (req, res) => {
//   const { fileName } = req.body;
//   file.deleteFile(fileName);
//   res.status(200).json({
//     message: "Files deleted successfully",
//   });
// };

exports.create = (req, res) => {
  // validate request
  if (!req.session.autenticated)
    res
      .status(401)
      .send({ status: "FAILURE", authorized: false, message: "Unauthorized" });

  if (!req.body)
    res.status(400).send({
      status: "FAILURE",
      message: "Content can not be empty!",
    });

  file.upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({
        status: "FAILURE",
        message: "Failed to upload file",
      });
    }
    const files = req.files;
    let fileNames = files?.map((file) => file.filename);
    fileNames = fileNames?.join(", ");

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
      file_name: fileNames,
    });

    // save customer in the database
    Str_List.create(str_list, (err, data) => {
      if (err)
        res.status(500).json({
          message:
            err.message || "Some error occurred while creating the customer.",
        });
      else
        res.json({ status: "SUCCESS", message: "Created successfully!", data });
    });
  });
};

exports.findAll = (req, res) => {
  if (!req.session.autenticated)
    res
      .status(401)
      .send({ status: "FAILURE", authorized: false, message: "Unauthorized" });

  if (req.session.BOResourceLogged) {
    var BOResourceLoggedIn = true;
  } else {
    var BOResourceLoggedIn = false;
  }

  const { page } = req.params;
  const { countPerPage } = req.params;
  const { searchInput } = req.params;
  const { searchRequested } = req.params;

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
      }
    );
  }
};

exports.delete = (req, res) => {
  if (!req.session.autenticated)
    res
      .status(401)
      .send({ status: "FAILURE", authorized: false, message: "Unauthorized" });

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
};

exports.updateCustomer = (req, res) => {
  if (!req.session.autenticated)
    res
      .status(401)
      .send({ status: "FAILURE", authorized: false, message: "Unauthorized" });

  if (!req.body)
    res
      .status(400)
      .send({ status: "FAILURE", message: "Content can not be empty!" });

  const { customerId } = req.params;
  const data = new Str_List(req.body);

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
      } else res.send({ message: "Customer data updated successfully!", data });
    }
  );
};
