import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  makeStyles,
  Box,
  Button,
  Card,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Grid,
  TextField,
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import DataTable from "react-data-table-component";
// import Page from 'src/components/Page';
import Page from "../../components/Page";

import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { Navigate } from "react-router-dom";
import { url } from "../../url";
import LinearProgress from "@material-ui/core/LinearProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import EditIcon from "@material-ui/icons/Edit";
import Alert from "@material-ui/lab/Alert";
const customerAction = [
  {
    value: "-1",
  },
  {
    value: "1",
    label: "Not Interested",
  },
  {
    value: "2",
    label: "In Progress",
  },
  {
    value: "3",
    label: "Opened Account",
  },
];
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
var pageForSearch = 0;
var prevSearchInput = "";
var updateID;
var searchInput = null;
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const PotentialCustomerAndStatus = ({}) => {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [values, setValues] = useState({
    company_name: "",
    contact_person: "",
    organization_type: "",
    phone: "",
    address: "",
    action: -1,
    inputError: false,
    account_number: "",
    message: "",
    disabled: true,
    messageDisabled: true,
    labelError: false,
  });

  const handleClose = () => {
    setOpenEdit(false);
  };

  const myRefname = useRef(null);
  // `user_ID`, `customer_branch`, `customer_name`, `account_number`, `customer_contact`, `reason`, `remark`, `efforts`, `responded`, `created_at`, `updated_at`
  const columns = [
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
      name: "Customer Opened Account",

      cell: (row) =>
        row.action == 3 ? (
          <CheckIcon style={{ fill: "green" }} />
        ) : row.action == 2 ? (
          <ClearIcon style={{ fill: "red" }} />
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
      name: "Add Status",

      cell: (row) =>
        row.id != null ? (
          row.action != 3 ? (
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
            " "
          )
        ) : (
          ""
        ),

      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const classes = useStyles();
  const [paginationReset, setPaginationReset] = useState(false);
  const [potentialCustomers, setPotentialCustomers] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(0);
  const [isLoggedIn, setAuthorized] = useState(true);
  const [totalRowCount, setTotalRowCount] = useState(1);
  const [dataFetched, setDataFetched] = useState(false);
  const countPerPage = 6;
  var searchRequested = false;
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    if (event.target.name == "action" && event.target.value == 3) {
      setValues({
        ...values,
        disabled: false,
        messageDisabled: true,
        [event.target.name]: 3,
      });
      console.log(values.disabled);
    } else if (event.target.name == "action" && event.target.value == 2) {
      setValues({
        ...values,
        disabled: true,
        messageDisabled: false,
        [event.target.name]: 2,
      });
    } else if (event.target.name == "action" && event.target.value == 1) {
      setValues({
        ...values,
        disabled: true,
        messageDisabled: true,
        [event.target.name]: 1,
      });
    }
  };
  const editPotentialCustomer = () => {
    if (values.action == -1) {
      setValues({
        ...values,
        inputError: true,
      });
    } else if (values.action == 2 && values.message.trim() === "") {
      setErrorMessage("Please submit status for inprogress potential customer");

      setValues({ ...values, labelError: true });
    } else if (values.action == 3 && values.account_number.trim() === "") {
      setErrorMessage(
        "Please provide customers account number. If you said you contacted, we need the account number"
      );
    } else if (values.action == 3 && values.account_number.length != 16) {
      setErrorMessage("Account number length must be 16 digit");
    } else {
      axios
        .put(
          url + "/potential_customer_status/" + updateID,
          {
            action: values.action,
            account_number: values.account_number,
            message: values.message,
          },
          { withCredentials: true }
        )
        .then(
          (data) => {
            window.location.reload(false);

            /* */
          },
          (error) => {
            alert("Connection to the server failed");
          }
        );
    }
  };
  const searchTriggred = (event) => {
    event.preventDefault();
    setPaginationReset(true);

    searchInput = event.target.value;
    if (event.target.value.trim() != "") {
      console.log("i am in true");
      searchRequested = true;
      getPotentialCustomersList();
    } else {
      searchRequested = false;
      console.log("i am in false");
      searchInput = null;
      getPotentialCustomersList();
    }
    prevSearchInput = searchInput;
    console.log("search triggred with " + searchInput);
    // Save  when form is submitted
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
        setDataFetched(true);
        setPaginationReset(false);
        res.data.splice(countPerPage, 1);

        setPotentialCustomers(res);
      })
      .catch((err) => {
        setPotentialCustomers({});
        setDataFetched(true);
      });
  };

  useEffect(() => {
    if (searchInput != null) {
      searchRequested = true;
    } else {
      searchRequested = false;
    }

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
          <Dialog
            open={openEdit}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
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
                  <Box
                    alignItems="center"
                    display="flex"
                    flexDirection="column"
                    p={2}
                  >
                    <Avatar className={classes.avatar} />
                    <Typography
                      className={classes.name}
                      color="textPrimary"
                      variant="h5"
                    >
                      {values.company_name} {"  ,  "}
                      {values.contact_person}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      {values.phone} {" ,  "} {values.address}
                    </Typography>
                  </Box>
                  <Divider />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          label="Is Contacted?"
                          name="action"
                          onChange={handleChange}
                          required
                          select
                          error={
                            values.action == -1
                              ? values.inputError
                                ? true
                                : false
                              : ""
                          }
                          SelectProps={{ native: true }}
                          variant="outlined"
                        >
                          {customerAction.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          label="Account Number"
                          name="account_number"
                          readOnly={false}
                          onChange={handleChange}
                          disabled={values.disabled}
                          required
                          aria-label="minimum height"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          label="Communication status"
                          name="message"
                          readOnly={false}
                          multiline
                          disabled={values.messageDisabled}
                          rows={3}
                          onChange={handleChange}
                          aria-label="minimum height"
                          variant="outlined"
                          error={values.labelError}
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
          <DataTable
            title="Potential customers"
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

export default PotentialCustomerAndStatus;
