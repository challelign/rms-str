import React, { useState, useEffect, useRef } from "react";
import AddIcon from "@material-ui/icons/Add";
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
  Typography,
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

import EditIcon from "@material-ui/icons/Edit";
import axios from "axios";

import { Navigate, json } from "react-router-dom";
import { url } from "../../url";
import { BatchUrl } from "../../batchExcuteURL";

import LinearProgress from "@material-ui/core/LinearProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ViewListIcon from "@material-ui/icons/ViewList";
import Slide from "@material-ui/core/Slide";
import DeleteIcon from "@material-ui/icons/Delete";

import Alert from "@material-ui/lab/Alert";
import RegistrationProminentCustomer from "./RegistrationProminentCustomer";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";

const baseURL = "https://jsonplaceholder.typicode.com/posts/";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
var customer_account = "";
var fcyCustomerName = "";
var branch_message = "";
var deleteID;
var deleteCustomerPaymentId;
var organization_nam = "";
var company = "";
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
const fcyPayment = [
  {
    value: "-1",
  },
  {
    value: "Western Union,",
    label: "Western Union,",
  },
  {
    value: "Express Money",
    label: "Express Money",
  },
  {
    value: "Money Gram",
    label: "Money Gram",
  },
  {
    value: "Dahabshiil",
    label: "Dahabshiil",
  },
  {
    value: "Ria",
    label: "Ria",
  },
  {
    value: "U-Remit",
    label: "U-Remit",
  },
  {
    value: "World Remit",
    label: "World Remit",
  },
  {
    value: "Shift",
    label: "Shift",
  },
  {
    value: "Irmaan",
    label: "Irmaan",
  },
  {
    value: "Exchenge",
    label: "Exchenge",
  },
];
const fcy = [
  {
    value: "-1",
  },
  {
    value: "U.S. Dollar (USD)",
    label: "U.S. Dollar (USD)",
  },
  {
    value: "European Euro (EUR)",
    label: "European Euro (EUR)",
  },
  {
    value: "Japanese Yen (JPY).",
    label: "Japanese Yen (JPY).",
  },
  {
    value: "British Pound (GBP)",
    label: "British Pound (GBP)",
  },
  {
    value: "Swiss Franc (CHF)",
    label: "Swiss Franc (CHF)",
  },
  {
    value: "Canadian Dollar (CAD)",
    label: "Canadian Dollar (CAD)",
  },
  {
    value: "Australian/New Zealand Dollar (AUD/NZD)",
    label: "Australian/New Zealand Dollar (AUD/NZD)",
  },
  {
    value: "South African Rand (ZAR)",
    label: "South African Rand (ZAR)",
  },
];
const ProminentCustomer = ({}) => {
  const [open, setOpen] = React.useState(false);
  const [deleteConfirmOpen, setdeleteConfirmOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openEditCustomer, setOpenEditPayment] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [paginationReset, setPaginationReset] = useState(false);
  const [fcyCustomerId, setFcyCustomerId] = useState(0);
  const [payment, setPayment] = useState({});
  const [values, setValues] = useState({
    organization_id: "",
    branch: "",
    // disbursed_loan: "",
    // borrowers_name: "",
    // district: "",
    // company_name: "",
    account_number: "",
    fcy_customer_id: "",
    mon_transf_type: "",
    ref_num: "",
    paid_date: "",
    sender_name: "",
    sender_country: "",
    sender_city: "",
    fcy: "",
    amount_in_fcy: "",
    amount_in_etb: "",
    remark: "",
    // account_number: "",
  });

  const [company_name, setCompany_name] = useState(null);

  const [options, setOptions] = useState([]);

  const searchTriggred = (event) => {
    event.preventDefault();
    setPaginationReset(true);

    searchInput = event.target.value;
    if (event.target.value.trim() != "") {
      searchRequested = true;
      getOrganizationList();
    } else {
      searchRequested = false;

      searchInput = null;
      getOrganizationList();
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
    // setLoadPayment(false);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setdeleteConfirmOpen(false);
    setOpenEdit(false);
    setOpenCreate(false);
    // setLoadPayment(false);
    setOpenEditPayment(false);
  };
  const myRefname = useRef(null);

  const columns = [
    {
      name: "Company Name",
      selector: "company_name",
    },

    {
      name: "Account Number",
      selector: "account_number",
    },
    {
      name: "Edit ",
      cell: (row) =>
        row.id != null ? (
          <Button
            onClick={() =>
              editClicked(row.id, row.company_name, row.account_number)
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
  const [page2, setPage2] = useState(0);
  const [potentialCustomers, setOrganizations] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage2, setErrorMessage2] = useState("");
  const [page, setPage] = useState(0);
  const [isLoggedIn, setAuthorized] = useState(true);
  const [totalRowCount, setTotalRowCount] = useState(1);
  const [dataFetched, setDataFetched] = useState(false);
  // const [loadShareholders, setLoadPayment] = useState(false);
  // const [paginationResetPayment, setPaginationResetPayment] = useState(false);

  const countPerPage = 6;

  const deleteClicked = (id, name) => {
    console.log(id);
    deleteID = id;
    organization_nam = name;
    setdeleteConfirmOpen(true);
  };

  const handleSubmitEdit = (event) => {
    event.preventDefault();
    // editFcyCustomer(); // Save  when form is submitted
    // alert(company_name);

    if (company_name === null) {
      setErrorMessage2("Please provide company name");
    } else if (values.account_number.trim() === "") {
      setErrorMessage2("Please provide Account number");
      return;
    } else if (
      values.account_number.trim() !== "" &&
      values.account_number.length !== 16
    ) {
      // alert("Account number length must be 16 digit.");
      setErrorMessage2("Account number length must be 16 digit.");
      return;
    } else {
      // alert(values.account_number);
      // alert(JSON.stringify(company_name.company_name));
      // return;
      axios
        .put(
          url + "/prominent_customer/" + updateID,
          {
            account_number: values.account_number,
            company_name: company_name.company_name,
            // company_name: company_name,
          },
          { withCredentials: true }
        )
        .then(
          (data) => {
            // alert(window.location);
            window.location.reload(true);
            // <Navigate to="/rms2/app/prominent_customer_loan" />;
            /* */
          },
          (error) => {
            alert("Connection to the server failed");
          }
        );
    }
    console.log("company_name, ", company_name);
    console.log("account_number ", values.account_number);
    console.log("updateID ", updateID);
  };

  const editClicked = (id, company_name, account_number) => {
    console.log(id);
    console.log(company_name);
    updateID = id;
    company = company_name;
    setCompany_name({
      ...values,
      ...company_name,
      company_name: company_name,
      account_number: account_number,
    });
    setValues({
      ...values,
      ...company_name,
      company_name: company_name,
      account_number: account_number,
    });

    setOpenEditPayment(true);
  };
  const handleChange = (event) => {
    setValues({
      ...values,
      ...company_name,
      [event.target.name]: event.target.value,
    });
  };

  const createPotentialCustomer = () => {
    setOpenCreate(true);
  };

  const deleteFCYCustomer = () => {
    console.log("delete called");
    axios
      .delete(url + "/prominent_customer/" + deleteID, {
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

  const getOrganizationList = () => {
    setDataFetched(false);
    // const storedPage = localStorage.getItem("pageNumber");
    // if (storedPage) {
    //   setPage(parseInt(storedPage));
    // }
    axios
      .get(
        `${url}/prominent_customer/all/${page}/${countPerPage}/${searchInput}/${searchRequested}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.authorized == false) {
          setAuthorized(false);
        }
        setOrganizations({});
        setTotalRowCount(res.data[res.data.length - 1].countRow);
        res.data.splice(countPerPage + 1, 1);
        report = res.data[res.data.length - 1].report;
        res.data.splice(countPerPage, 1);
        // localStorage.setItem("pageNumber", JSON.stringify(page));

        setPaginationReset(false);
        setDataFetched(true);

        setOrganizations(res);
      })
      .catch((err) => {
        setOrganizations({});
        setDataFetched(true);
      });
  };

  useEffect(() => {
    axios
      .get(`${url}/potential_customers_distinct`, {
        withCredentials: true,
      })
      .then((response) => {
        // console.log("response", response);
        setOptions(response.data);
        console.log("potential customers name I S", response.data);
      });
  }, []);
  useEffect(() => {
    getOrganizationList();
  }, [page]);
  // useEffect(() => {
  //   const cuPage = localStorage.getItem("pageNumber");
  //   if (cuPage !== null) setPage(JSON.parse(cuPage));
  //   getOrganizationList();
  // }, [page, countPerPage]);

  // useEffect(() => {
  // getOrganizationList();
  // const storedPage = localStorage.getItem("pageNumber");
  // if (storedPage) {
  //   // setPage(parseInt(storedPage));
  //   var page = parseInt(storedPage);
  // }
  // const storedPageNumber = localStorage.getItem("pageNumber");
  // const pageNumberToFetch = storedPageNumber
  //   ? parseInt(storedPageNumber)
  //   : page;
  // axios
  //   .get(
  //     `${url}/prominent_customer/all/${page}/${countPerPage}/${searchInput}/${searchRequested}`,
  //     {
  //       withCredentials: true,
  //     }
  //   )
  //   .then((res) => {
  //     if (res.data.authorized == false) {
  //       setAuthorized(false);
  //     }
  //     setOrganizations({});
  //     setTotalRowCount(res.data[res.data.length - 1].countRow);
  //     res.data.splice(countPerPage + 1, 1);
  //     report = res.data[res.data.length - 1].report;
  //     res.data.splice(countPerPage, 1);
  //     window.localStorage.setItem("pageNumber", page);
  //     setPaginationReset(false);
  //     setDataFetched(true);
  //     setOrganizations(res);
  //   })
  //   .catch((err) => {
  //     setOrganizations({});
  //     setDataFetched(true);
  //   });
  // }, [page, countPerPage]);

  // const handlePageChange = (page) => {
  // const storedPageNumber = localStorage.getItem("pageNumber");
  // const pageNumberToFetch = storedPageNumber
  //   ? parseInt(storedPageNumber)
  //   : page;
  // onChangePage={(page) => setPage(page - 1)}
  // const storedPageNumber = localStorage.getItem("pageNumber");
  // if (storedPageNumber) {
  //   const newPage = storedPageNumber ? parseInt(storedPageNumber) : page;
  //   setPage(newPage - 1);
  // }
  // setPage(page - 1);
  // };
  return (
    <Page
      className={classes.root}
      title="Prominent Customer Loan Profile"
      breadcrumbs={[{ name: "Forms", active: true }]}
    >
      {isLoggedIn ? (
        <Container>
          <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            <Divider />

            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          <Button
            style={{ marginLeft: "auto", float: "right" }}
            variant="outlined"
            color="primary"
            onClick={() => createPotentialCustomer()}
          >
            <PersonAddIcon /> Create new Prominent Company
          </Button>

          <Dialog
            open={openCreate}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {"Add Prominent Company Account "}
            </DialogTitle>
            {/* FCY component  */}
            <DialogContent>
              <RegistrationProminentCustomer />
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose} color="primary">
                No cancel
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openEditCustomer}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseEdit}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {"Edit Prominent Company :"} {company}
            </DialogTitle>
            <DialogContent>
              <form
                autoComplete="off"
                noValidate
                // className={clsx(classes.root, className)}
                // {...rest}
                onSubmit={handleSubmitEdit}
              >
                <Card>
                  {errorMessage2 != "" ? (
                    <div className="error">
                      <Alert severity="warning">{errorMessage2}</Alert>
                    </div>
                  ) : (
                    ""
                  )}
                  <CardHeader />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item md={12} xs={12}>
                        {/* <p>{JSON.stringify(options)}</p> */}
                        <Autocomplete
                          required
                          id="combo-box-demo"
                          value={company_name}
                          options={options}
                          getOptionLabel={(options) =>
                            options.company_name || ""
                          }
                          onChange={(event, value) => {
                            setCompany_name(value);
                          }}
                          // onChange={handleCompanyChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Search Company Name"
                              variant="outlined"
                              value={company_name}
                              required
                            />
                          )}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Account Number"
                          name="account_number"
                          readOnly={false}
                          // onChange={(event) => setValues(event.target.value)}
                          onChange={handleChange}
                          value={values.account_number}
                          required
                          variant="outlined"
                        />
                        <p>Account Length Should be 16 Long </p>
                        <p>Current Length {values.account_number.length}</p>
                      </Grid>
                      <Grid item md={6} xs={12}></Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                  <Box display="flex" justifyContent="flex-end" p={2}>
                    <Grid>
                      <Button
                        onClick={handleCloseEdit}
                        variant="outlined"
                        color="primary"
                      >
                        Close
                      </Button>
                    </Grid>
                    <Grid>
                      <Button variant="outlined" color="primary" type="submit">
                        Create
                      </Button>
                    </Grid>
                  </Box>
                </Card>
              </form>
            </DialogContent>

            <DialogActions></DialogActions>
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
              {"Delete Organization ?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Are you sure you want to delete customer {organization_nam}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                No cancel
              </Button>
              <Button onClick={deleteFCYCustomer} color="primary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          {!dataFetched ? <LinearProgress /> : ""}

          <Paper component="form">
            <InputBase
              className={classes.input}
              onChange={searchTriggred}
              placeholder="Search Prominent Company"
              inputProps={{ "aria-label": "search google maps" }}
            />
            <IconButton className={classes.iconButton} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>

          <DataTable
            title={"Prominent Company Loan Profile"}
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

            // onChangePage={(page) => handlePageChange(page)}
          />
        </Container>
      ) : (
        <Navigate to="/rms2/login" />
      )}
    </Page>
  );
};

export default ProminentCustomer;
