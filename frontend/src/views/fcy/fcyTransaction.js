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

import { Navigate } from "react-router-dom";
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
import PotentialCustomers from "./registerFCY";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
var customer_account = "";
var fcyCustomerName = "";
var branch_message = "";
var deleteID;
var deleteCustomerPaymentId;
var organization_nam = "";
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
const LegalPerson = ({}) => {
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
		full_name: "",
		account_number: "",
		phone: "",
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
		// account_number: '',
		// account_number: '',
		// phone: '',
		credit_amount: "",
	});

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

	const handleClickOpen = (fcy_customer_id, name) => {
		fcyCustomerName = name;
		setFcyCustomerId(fcy_customer_id);
		setOpen(true);

		setLoadPayment(true);
	};
	const handleClose = () => {
		setOpen(false);
		setdeleteConfirmOpen(false);
		setOpenEdit(false);
		setOpenCreate(false);
		setLoadPayment(false);
	};
	const handleCloseEdit = () => {
		setOpenEdit(false);
		setdeleteConfirmOpen(false);
		setOpenEdit(false);
		setOpenCreate(false);
		setLoadPayment(false);
		setOpenEditPayment(false);
	};
	const myRefname = useRef(null);
	// `user_ID`, `customer_branch`, `customer_name`, `account_number`, `customer_contact`, `reason`, `remark`, `efforts`, `responded`, `created_at`, `updated_at`

	const columns2 = [
		{
			name: "Payer Branch",
			selector: "branch_name",
		},
		{
			name: "Money Transfer Type",
			selector: "mon_transf_type",
		},

		{
			name: "Reference Number",
			selector: "ref_num",
		},

		{
			name: "Payed Date",
			selector: "paid_date",
		},
		{
			name: "Sender Name",
			selector: "sender_name",
		},

		{
			name: "Sender Country",
			selector: "sender_country",
		},
		{
			name: "Sender City",
			selector: "sender_city",
		},

		{
			name: "fcy",
			selector: "fcy",
		},
		{
			name: "Amount in FCY",
			selector: "amount_in_fcy",
		},

		{
			name: "Amount in ETB",
			selector: "amount_in_etb",
		},
		{
			name: "Remark",
			selector: "remark",
		},

		{
			name: "Delete",

			cell: (row) =>
				row.id != null ? (
					<Button onClick={() => deleteShClicked(row.id, row.full_name)}>
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

	const columns = [
		{
			name: "FCY Customer Name",
			selector: "full_name",
		},
		{
			name: "Phone Number",
			selector: "phone",
		},

		{
			name: "Account Number",
			selector: "account_number",
		},
		{
			name: "Credit Amount",
			selector: "credit_amount",
		},
		{
			name: "Add FCY Payment",
			cell: (row) =>
				row.id != null ? (
					<Button
						onClick={() =>
							addClicked(row.id, row.full_name, row.account_number, row.phone)
						}
					>
						<AddIcon style={{ fill: "#00094B" }} />
					</Button>
				) : (
					""
				),

			ignoreRowClick: true,
			allowOverflow: true,
			button: true,
		},
		{
			name: "Edit",
			cell: (row) =>
				row.id != null ? (
					<Button
						onClick={() =>
							editClicked(
								row.id,
								row.full_name,
								row.account_number,
								row.phone,
								row.credit_amount
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
			name: "View Payment Lists",
			cell: (row) =>
				row.id != null ? (
					<Button onClick={() => handleClickOpen(row.id, row.full_name)}>
						<ViewListIcon style={{ fill: "#00094B" }} />
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
					<Button onClick={() => deleteClicked(row.id, row.full_name)}>
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
	const [dataFetchedPayment, setDataFetchedPayment] = useState(false);
	const [totalRowCountPayment, setTotalRowCountPayment] = useState(1);
	const [loadShareholders, setLoadPayment] = useState(false);
	const [paginationResetPayment, setPaginationResetPayment] = useState(false);

	const countPerPage = 6;
	const handleChange = (event) => {
		setValues({
			...values,
			[event.target.name]: event.target.value,
		});
	};

	const editFcyCustomer = () => {
		if (values.phone.trim() === "") {
			setErrorMessage2("Please provide phone number");
		} else if (values.full_name.trim() === "") {
			setErrorMessage2("Please provide fcy customer name");
		} else if (values.phone.length != 10) {
			setErrorMessage2(
				"Phone number length must be 10 digit. Example 0911111111"
			);
		} else if (
			values.account_number.trim() !== "" &&
			values.account_number.length != 16
		) {
			setErrorMessage2("Account number length must be 16 digit.");
		} else {
			axios
				.put(
					url + "/fcyCustomer/" + updateID,
					{
						phone: values.phone,
						full_name: values.full_name,
						account_number: values.account_number,
						credit_amount: values.credit_amount,
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
		console.log(values.phone);
		console.log(updateID);
	};
	const addFcyPayment = () => {
		if (values.ref_num.trim() === "") {
			setErrorMessage("Please provide reference number");
		} else if (values.mon_transf_type.trim() === "") {
			setErrorMessage("Please provide transfer type");
		} else if (values.paid_date.trim() === "") {
			setErrorMessage("Please provide paid date");
		} else if (values.sender_name.trim() === "") {
			setErrorMessage("Please provide sender name");
		} else if (values.sender_country.trim() === "") {
			setErrorMessage("Please provide sender country");
		} else if (values.sender_city.trim() === "") {
			setErrorMessage("Please provide sender city");
		} else if (values.fcy.trim() === "") {
			setErrorMessage("Please provide fcy");
		} else if (values.amount_in_fcy.trim() === "") {
			setErrorMessage("Please provide amount in fcy");
		} else if (values.amount_in_etb.trim() === "") {
			setErrorMessage("Please provide amount in ETB");
		} else {
			axios
				.post(
					url + "/fcyPayment",
					{
						fcy_customer_id: updateID,
						mon_transf_type: values.mon_transf_type,
						ref_num: values.ref_num,
						paid_date: values.paid_date,
						sender_name: values.sender_name,
						sender_country: values.sender_country,
						sender_city: values.sender_city,
						fcy: values.fcy,
						amount_in_fcy: values.amount_in_fcy,
						amount_in_etb: values.amount_in_etb,
						remark: values.remark,
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
	const deleteShClicked = (id, name) => {
		console.log(id);
		deleteCustomerPaymentId = id;
		deletePayment();
	};
	const deleteClicked = (id, name) => {
		console.log(id);
		deleteID = id;
		organization_nam = name;
		setdeleteConfirmOpen(true);
	};
	const handleSubmit = (event) => {
		event.preventDefault();
		addFcyPayment(); // Save  when form is submitted
	};
	const handleSubmitEdit = (event) => {
		event.preventDefault();
		editFcyCustomer(); // Save  when form is submitted
	};
	const addClicked = (id, full_name, account_number, phone) => {
		console.log(id);
		updateID = id;
		setValues({
			...values,
			full_name: full_name,
			executive_director_name: account_number,
			remark: phone,
		});

		setOpenEdit(true);
	};

	const editClicked = (id, full_name, account_number, phone, credit_amount) => {
		console.log(id);
		updateID = id;
		setValues({
			...values,
			full_name: full_name,
			account_number: account_number,
			phone: phone,
			credit_amount: credit_amount,
		});

		setOpenEditPayment(true);
	};

	const createPotentialCustomer = () => {
		setOpenCreate(true);
	};

	const deletePayment = () => {
		let deletionConfirmed = window.confirm("Are you sure you want to delete?");

		if (deletionConfirmed) {
			console.log("delete called");
			axios
				.delete(url + "/fcy_payment/" + deleteCustomerPaymentId, {
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
		}
		// true if OK is pressed
	};

	const deleteFCYCustomer = () => {
		console.log("delete called");
		axios
			.delete(url + "/fcy/" + deleteID, {
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
	const getFCYPayment = () => {
		setPayment({});
		setDataFetchedPayment(false);
		axios
			.get(
				`${url}/fcy_payment/all/${page2}/${countPerPage}/${searchInput}/${searchRequested}/${fcyCustomerId}`,
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				if (res.data.authorized == false) {
					setAuthorized(false);
				}

				setTotalRowCountPayment(res.data[res.data.length - 1].countRow);
				setDataFetchedPayment(true);
				setPaginationResetPayment(false);
				res.data.splice(countPerPage, 1);

				setPayment(res);
			})
			.catch((err) => {
				setPayment({});
				setDataFetchedPayment(true);
			});
	};
	const getOrganizationList = () => {
		setDataFetched(false);
		axios
			.get(
				`${url}/fcy/all/${page}/${countPerPage}/${searchInput}/${searchRequested}`,
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
		getOrganizationList();
	}, [page]);
	useEffect(() => {
		getFCYPayment();
	}, [fcyCustomerId, page2]);
	return (
		<Page
			className={classes.root}
			title="Organization"
			breadcrumbs={[{ name: "Forms", active: true }]}
		>
			{isLoggedIn ? (
				<Container style={{ marginTop: 2 }}>
					<Dialog
						fullWidth
						maxWidth="sm"
						open={open}
						onClose={handleClose}
						aria-labelledby="form-dialog-title"
					>
						<DialogTitle id="form-dialog-title">
							{!dataFetchedPayment ? <LinearProgress /> : ""}
							<DataTable
								title={
									<Typography variant="h3" gutterBottom>
										List of payments with {fcyCustomerName}
									</Typography>
								}
								columns={columns2}
								data={payment.data}
								highlightOnHover
								pagination
								paginationServer
								paginationTotalRows={totalRowCountPayment}
								paginationPerPage={countPerPage}
								striped={true}
								hover={true}
								pagination={dataFetchedPayment}
								paginationResetDefaultPage={paginationResetPayment}
								onChangeRowsPerPage={(perPage) => 4}
								possibleNumberPerPage={[2, 3, 4, 5, 6]}
								paginationComponentOptions={{
									noRowsPerPage: true,
								}}
								onChangePage={(page2) => setPage2(page2 - 1)}
							/>
						</DialogTitle>
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
						<PersonAddIcon />
						{"  "} Create new FCY Customer
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
						open={openCreate}
						TransitionComponent={Transition}
						keepMounted
						onClose={handleClose}
						aria-labelledby="alert-dialog-slide-title"
						aria-describedby="alert-dialog-slide-description"
					>
						<DialogTitle id="alert-dialog-slide-title">
							{"Add Organization"}
						</DialogTitle>
						{/* FCY component  */}
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
						open={openEditCustomer}
						TransitionComponent={Transition}
						keepMounted
						onClose={handleCloseEdit}
						aria-labelledby="alert-dialog-slide-title"
						aria-describedby="alert-dialog-slide-description"
					>
						<DialogTitle id="alert-dialog-slide-title">
							{"Add FCY Payment for "} {values.full_name}
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
											<Grid item md={6} xs={12}>
												<TextField
													fullWidth
													label="Phone"
													name="phone"
													readOnly={false}
													onChange={handleChange}
													required
													value={values.phone}
													variant="outlined"
												/>
											</Grid>
											<Grid item md={6} xs={12}>
												<TextField
													fullWidth
													label="Full Name"
													name="full_name"
													readOnly={false}
													onChange={handleChange}
													value={values.full_name}
													required
													variant="outlined"
												/>
											</Grid>
											<Grid item md={6} xs={12}>
												<TextField
													fullWidth
													label="Account Number"
													name="account_number"
													readOnly={false}
													onChange={handleChange}
													value={values.account_number}
													required
													variant="outlined"
												/>
											</Grid>
											<Grid item md={6} xs={12}>
												<TextField
													fullWidth
													label="Credit Amount"
													name="credit_amount"
													readOnly={false}
													onChange={handleChange}
													value={values.credit_amount}
													required
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
						open={openEdit}
						TransitionComponent={Transition}
						keepMounted
						onClose={handleClose}
						aria-labelledby="alert-dialog-slide-title"
						aria-describedby="alert-dialog-slide-description"
					>
						<DialogTitle id="alert-dialog-slide-title">
							{"Add FCY Payment for "} {values.full_name}
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
													label="Money Transfer Agent"
													name="mon_transf_type"
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
													{fcyPayment.map((option) => (
														<option
															key={option.value}
															value={option.value}
															//selected={customer_contact == option.value}
														>
															{option.label}
														</option>
													))}
												</TextField>
											</Grid>
											<Grid item md={6} xs={12}>
												<TextField
													fullWidth
													label="Reference Number"
													name="ref_num"
													readOnly={false}
													onChange={handleChange}
													required
													variant="outlined"
												/>
											</Grid>
											<Grid item md={6} xs={12}>
												<TextField
													id="date"
													label="Paid Date"
													name="paid_date"
													type="date"
													onChange={handleChange}
													defaultValue={
														new Date().getDate() +
														"-" +
														(new Date().getMonth() + 1) +
														"-" +
														new Date().getFullYear()
													}
													sx={{ width: 220 }}
													InputLabelProps={{
														shrink: true,
													}}
												/>
											</Grid>
											<Grid item md={6} xs={12}>
												<TextField
													fullWidth
													label="Sender Name"
													name="sender_name"
													readOnly={false}
													onChange={handleChange}
													required
													variant="outlined"
												/>
											</Grid>
											<Grid item md={6} xs={12}>
												<TextField
													fullWidth
													label="Sender Country"
													name="sender_country"
													readOnly={false}
													onChange={handleChange}
													required
													variant="outlined"
												/>
											</Grid>
											<Grid item md={6} xs={12}>
												<TextField
													fullWidth
													label="Sender City"
													name="sender_city"
													readOnly={false}
													onChange={handleChange}
													required
													variant="outlined"
												/>
											</Grid>
											<Grid item md={6} xs={12}>
												<TextField
													fullWidth
													label="FCY"
													name="fcy"
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
													{fcy.map((option) => (
														<option
															key={option.value}
															value={option.value}
															//selected={customer_contact == option.value}
														>
															{option.label}
														</option>
													))}
												</TextField>
											</Grid>
											<Grid item md={6} xs={12}>
												<TextField
													fullWidth
													label="Amount In FCY"
													name="amount_in_fcy"
													readOnly={false}
													onChange={handleChange}
													required
													variant="outlined"
												/>
											</Grid>
											<Grid item md={6} xs={12}>
												<TextField
													fullWidth
													label="Amount In ETB"
													name="amount_in_etb"
													readOnly={false}
													onChange={handleChange}
													required
													variant="outlined"
												/>
											</Grid>
											<Grid item md={6} xs={12}>
												<TextField
													fullWidth
													label="Remark"
													name="remark"
													readOnly={false}
													onChange={handleChange}
													required
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
							placeholder="Search FCY Customer"
							inputProps={{ "aria-label": "search google maps" }}
						/>
						<IconButton className={classes.iconButton} aria-label="search">
							<SearchIcon />
						</IconButton>
					</Paper>
					<DataTable
						title={"Remittance Customer Profile"}
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

export default LegalPerson;
