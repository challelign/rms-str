import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  makeStyles,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Box,
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import DataTable from "react-data-table-component";
// import Page from 'src/components/Page';
import Page from "../../components/Page";

import axios from "axios";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { Navigate } from "react-router-dom";
import { url } from "../../url";
import { BatchUrl } from "../../batchExcuteURL";
import LinearProgress from "@material-ui/core/LinearProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Alert from "@material-ui/lab/Alert";
import PotentialCustomers from "./potentialCustomer";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import district from "./districtList";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
var customer_account = "";
var branch_message = "";
var deleteID;
var company_name = "";
var updateID;
var report = "";
var prevSearchInput = "";
var searchRequested = false;
var searchInput = null;
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const PotentialCustomerList = ({}) => {
  const [open, setOpen] = React.useState(false);
  const [deleteConfirmOpen, setdeleteConfirmOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [paginationReset, setPaginationReset] = useState(false);
  const [values, setValues] = useState({
    company_name: "",
    contact_person: "",
    organization_type: "",
    phone: "",
    address: "",
  });
  const displayCommunicationStatus = (account, message) => {
    customer_account = account;
    branch_message = message;

    setOpen(true);
  };
  const searchTriggred = (event) => {
    event.preventDefault();
    setPaginationReset(true);

    searchInput = event.target.value;
    if (event.target.value.trim() != "") {
      searchRequested = true;
      getPotentialCustomersList();
    } else {
      searchRequested = false;

      searchInput = null;
      getPotentialCustomersList();
    }
    prevSearchInput = searchInput;
    console.log("search triggred with " + searchInput);
    // Save  when form is submitted
  };
  const handleClose = () => {
    setOpen(false);
    setdeleteConfirmOpen(false);
    setOpenEdit(false);
    setOpenCreate(false);
  };

  const myRefname = useRef(null);
  // `user_ID`, `customer_branch`, `customer_name`, `account_number`, `customer_contact`, `reason`, `remark`, `efforts`, `responded`, `created_at`, `updated_at`
  const columns = [
    {
      name: "Account Opened",

      cell: (row) =>
        row.action == 3 ? (
          <CheckIcon style={{ fill: "green" }} />
        ) : row.action == 2 ? (
          <AutorenewIcon style={{ fill: "green" }} />
        ) : row.action == 1 ? (
          <ClearIcon style={{ fill: "red" }} />
        ) : row.action == 0 ? (
          <ClearIcon style={{ fill: "red" }} />
        ) : (
          ""
        ),

      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Status on Operation",

      cell: (row) =>
        row.action == 1 ? (
          <Button disabled="true">
            <h2
              className="tryout"
              style={{ fontSize: "10px", color: "#cc3300" }}
            >
              Not Interested{" by "}
              {row.branch}
            </h2>
          </Button>
        ) : row.action == 2 ? (
          <Button
            color="primary"
            onClick={() =>
              displayCommunicationStatus(row.account_number, row.message)
            }
          >
            <h2 className="tryout" style={{ fontSize: "10px" }}>
              In Progress{" by "}
              {row.branch}
            </h2>
          </Button>
        ) : row.action == 3 ? (
          <Button
            onClick={() =>
              displayCommunicationStatus(row.account_number, row.message)
            }
          >
            <h2 className="tryout" style={{ fontSize: "10px" }}>
              {row.account_number}
              {" by "}
              {row.branch}
            </h2>
          </Button>
        ) : row.action == 0 ? (
          <Button>
            <h2
              className="tryout"
              style={{ fontSize: "10px", color: "#F08080" }}
            >
              No Response
            </h2>
          </Button>
        ) : (
          ""
        ),

      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Company Name",
      selector: "company_name",
    },
    {
      name: "Organization Type",
      selector: "organization_type",
    },

    {
      name: "Contact Person",
      selector: "contact_person",
    },

    {
      name: "District",
      selector: "phone",
    },
    {
      name: "Branch",
      selector: "address",
    },

    {
      name: "Edit",

      cell: (row) =>
        row.id != null ? (
          <Button
            onClick={() =>
              editClicked(
                row.id,
                row.company_name,
                row.organization_type,
                row.contact_person,
                row.phone,
                row.address
              )
            }
          >
            <EditIcon style={{ fill: "#00094B" }} />
          </Button>
        ) : (
          ""
        ),

      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Delete",

      cell: (row) =>
        row.id != null ? (
          <Button onClick={() => deleteClicked(row.id, row.company_name)}>
            <DeleteIcon style={{ fill: "#00094B" }} />
          </Button>
        ) : (
          ""
        ),

      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const classes = useStyles();
  const [potentialCustomers, setPotentialCustomers] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(0);
  const [isLoggedIn, setAuthorized] = useState(true);
  const [totalRowCount, setTotalRowCount] = useState(1);
  const [dataFetched, setDataFetched] = useState(false);
  const countPerPage = 6;
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };
  const editPotentialCustomer = () => {
    if (values.company_name.trim() === "") {
      setErrorMessage("Please provide company name");
    } else if (values.contact_person.trim() === "") {
      setErrorMessage("Please provide Branch");
    } else if (values.phone.trim() === "") {
      setErrorMessage("Please Select District");
    } else {
      axios
        .put(
          url + "/potential_customer/" + updateID,
          {
            company_name: values.company_name,
            contact_person: values.contact_person,
            organization_type: values.organization_type,
            phone: values.phone,
            address: values.address,
          },
          { withCredentials: true }
        )
        .then(
          (data) => {
            window.location.reload(false);

            /* */
          },
          (error) => {
            axios.post(BatchUrl, {}).then((login) => {
              /* */
            });

            alert("Connection to the server failed , please try again :)");
          }
        );
    }
  };
  const deleteClicked = (id, name) => {
    console.log(id);
    deleteID = id;
    company_name = name;
    setdeleteConfirmOpen(true);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    editPotentialCustomer(); // Save  when form is submitted
  };
  const editClicked = (id, name, org_type, contact_person, phone, address) => {
    console.log(id);
    updateID = id;
    setValues({
      ...values,
      company_name: name,
      contact_person: contact_person,
      organization_type: org_type,
      phone: phone,
      address: address,
    });

    setOpenEdit(true);
  };

  const createPotentialCustomer = () => {
    setOpenCreate(true);
  };

  const deleteCustomer = () => {
    console.log("delete called");
    axios
      .delete(url + "/potential_customer/" + deleteID, {
        withCredentials: true,
      })
      .then(
        (res) => {
          window.location.reload(false);
          alert(res.data.message);
          /* */
        },
        (error) => {
          axios.post(BatchUrl, {}).then((login) => {
            /* */
          });

          alert("Connection to the server failed , please try again :)");
        }
      );
  };
  const getPotentialCustomersList = () => {
    setDataFetched(false);
    axios
      .get(
        `${url}/potential_customer/all/${page}/${countPerPage}/${searchInput}/${searchRequested}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.authorized == false) {
          setAuthorized(false);
        }
        setPotentialCustomers({});
        setTotalRowCount(res.data[res.data.length - 1].countRow);
        res.data.splice(countPerPage + 1, 1);
        report = res.data[res.data.length - 1].report;
        res.data.splice(countPerPage, 1);
        setPaginationReset(false);
        setDataFetched(true);

        setPotentialCustomers(res);
      })
      .catch((err) => {
        setPotentialCustomers({});
        setDataFetched(true);
      });
  };

  useEffect(() => {
    getPotentialCustomersList();
  }, [page]);

  return (
    <Page
      className={classes.root}
      title="Potential Customers"
      breadcrumbs={[{ name: "Forms", active: true }]}
    >
      {isLoggedIn ? (
        <Container style={{ marginTop: 2 }}>
          <Button
            style={{ marginLeft: "auto", float: "right" }}
            variant="outlined"
            color="primary"
            onClick={() => createPotentialCustomer()}
          >
            <PersonAddIcon />
            {"  "} Create Potential Customer
          </Button>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {"Communication Status"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                {" " + customer_account + " "}, {branch_message}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={deleteConfirmOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {"Delete potential Customer ?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Are you sure you want to delete potential customer{" "}
                {company_name}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                No cancel
              </Button>
              <Button onClick={deleteCustomer} color="primary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openCreate}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {"Create Potential Customer"}
            </DialogTitle>
            <DialogContent>
              <PotentialCustomers />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                No cancel
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openEdit}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {"Edit potential customer data"}
            </DialogTitle>
            <DialogContent>
              <form
                autoComplete="off"
                noValidate
                // className={clsx(classes.root, className)}
                // {...rest}
                onSubmit={handleSubmit}
              >
                <Card>
                  {errorMessage != "" ? (
                    <div className="error">
                      <Alert severity="warning">{errorMessage}</Alert>
                    </div>
                  ) : (
                    ""
                  )}
                  <CardHeader />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          label="Company Name"
                          name="company_name"
                          readOnly={false}
                          value={values.company_name}
                          onChange={handleChange}
                          required
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          label="Branch"
                          name="contact_person"
                          readOnly={false}
                          onChange={handleChange}
                          value={values.contact_person}
                          required
                          aria-label="minimum height"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          label="Organization Type"
                          name="organization_type"
                          readOnly={false}
                          onChange={handleChange}
                          value={values.organization_type}
                          aria-label="minimum height"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        {/* <TextField
                          fullWidth
                          label="Phone"
                          name="phone"
                          readOnly={false}
                          onChange={handleChange}
                          value={values.phone}
                          aria-label="minimum height"
                          variant="outlined"
                        /> */}
                        <TextField
                          fullWidth
                          label="Select District"
                          name="phone"
                          onChange={handleChange}
                          required
                          select
                          error={
                            values.actions == -1
                              ? values.inputError
                                ? true
                                : false
                              : ""
                          }
                          SelectProps={{ native: true }}
                          // value={values.customerAction}
                          variant="outlined"
                        >
                          {district.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              selected={values.phone === option.value}
                            >
                              {option.label}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          label="Address"
                          name="address"
                          readOnly={false}
                          onChange={handleChange}
                          value={values.address}
                          aria-label="minimum height"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item md={6} xs={12}></Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                  <Box display="flex" justifyContent="flex-end" p={2}>
                    <Grid>
                      {" "}
                      <Button
                        onClick={handleClose}
                        variant="outlined"
                        color="primary"
                      >
                        Close
                      </Button>
                    </Grid>
                    <Grid>
                      <Button variant="outlined" color="primary" type="submit">
                        Update
                      </Button>
                    </Grid>
                  </Box>
                </Card>
              </form>
            </DialogContent>
            <DialogActions></DialogActions>
          </Dialog>

          {!dataFetched ? <LinearProgress /> : ""}
          <Paper component="form">
            <InputBase
              className={classes.input}
              onChange={searchTriggred}
              placeholder="Search Potential Customer"
              inputProps={{ "aria-label": "search google maps" }}
            />
            <IconButton className={classes.iconButton} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
          <DataTable
            title={report}
            columns={columns}
            data={potentialCustomers.data}
            highlightOnHover
            pagination
            paginationServer
            paginationTotalRows={totalRowCount}
            paginationPerPage={countPerPage}
            striped={true}
            hover={true}
            pagination={dataFetched}
            paginationResetDefaultPage={paginationReset}
            onChangeRowsPerPage={(perPage) => 4}
            possibleNumberPerPage={[2, 3, 4, 5, 6]}
            paginationComponentOptions={{
              noRowsPerPage: true,
            }}
            onChangePage={(page) => setPage(page - 1)}
          />
        </Container>
      ) : (
        <Navigate to="/rms2/login" />
      )}
    </Page>
  );
};

export default PotentialCustomerList;
