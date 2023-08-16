import React, { useState, useEffect, useRef } from "react";
import {
	Grid,
	Container,
	Button,
	makeStyles,
	Paper,
	InputBase,
	IconButton,
	CardHeader,
	Divider,
	Box,
	Card,
	CardContent,
	TextField,
	Typography,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { AxiosError } from "axios";

import DataTable from "react-data-table-component";
// import Page from 'src/components/Page';
import SearchIcon from "@material-ui/icons/Search";
import Page from "../../components/Page";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import LinearProgress from "@material-ui/core/LinearProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ViewListIcon from "@material-ui/icons/ViewList";
import axios from "axios";
import FileUpload from "./FileUpload";
import Popup from "reactjs-popup";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { Navigate } from "react-router-dom";
import Slide from "@material-ui/core/Slide";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { CloudUpload as CloudUploadIcon } from "@material-ui/icons";
import moment from "moment";

import { url } from "../../url";
import StrRegister from "./StrRegister";
import Alert from "@material-ui/lab/Alert/Alert";
import DetailStrCustomer from "./DetailStrCustomer";
window.$updateId = 0;
window.$customer_name = "Test Name";
window.$isLogged = 0;

window.$customer_name = "";
window.$customer_address = "";
window.$account_number = "";
window.$transaction_id = "";
window.$customer_id = "";
window.$reason = "";

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

	paper: {
		display: "flex",
		alignItems: "center",
		borderRadius: theme.shape.borderRadius,
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
	},
}));
var searchRequested = false;
var searchInput = null;
var prevSearchInput = "";
var report = "";

const StrList = () => {
	const [values, setValues] = useState({
		customer_name: "",
		account_number: "",
		address: "",
		transaction_id: "",
		customer_id: "",
		reason: "",
		file_name: "",
		created_at: "",
	});

	const [openCreate, setOpenCreate] = useState(false);
	const [open, setOpen] = React.useState(false);
	const [deleteConfirmOpen, setdeleteConfirmOpen] = React.useState(false);
	const classes = useStyles();
	const [dormantAccounts, setDormantAccounts] = useState({});
	const [page, setPage] = useState(0);
	const [isLoggedIn, setAuthorized] = useState(true);
	const [totalRowCount, setTotalRowCount] = useState(1);
	const [dataFetched, setDataFetched] = useState(false);
	const [openEditCustomer, setOpenEditCustomer] = useState(false);
	const [openFileUploadCustomer, setOpenFileUploadCustomer] = useState(false);

	const [openDetailCustomer, setOpenDetailCustomer] = useState(false);
	const [openEdit, setOpenEdit] = React.useState(false);
	const [errorMessage2, setErrorMessage2] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [files, setFiles] = useState([
		// "chalie.mp4",
		// "chalie.mp4",
		// "chalie.mp4",
	]);
	const [paginationReset, setPaginationReset] = useState(false);
	const countPerPage = 6;
	const handleFileChange = (event) => {
		setFiles(event.target.files);
	};
	const createSTRUser = () => {
		setOpenCreate(true);
	};
	const handleChange = (event) => {
		setValues({
			...values,
			[event.target.name]: event.target.value,
		});
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
		setOpenEditCustomer(false);
		setOpenDetailCustomer(false);
		setOpenFileUploadCustomer(false);
	};
	const myRefname = useRef(null);

	const editClicked = (
		id,
		customer_name,
		address,
		account_number,
		transaction_id,
		customer_id,
		reason,
		created_at
		// file_name
	) => {
		console.log(id);
		updateID = id;
		setValues({
			...values,
			customer_name: customer_name,
			address: address,
			account_number: account_number,
			transaction_id: transaction_id,
			customer_id: customer_id,
			reason: reason,
			created_at: created_at,
			// file_name: file_name,
		});

		setOpenEditCustomer(true);
	};

	const clickFileUpload = (
		id,
		customer_name,
		address,
		account_number,
		transaction_id,
		customer_id,
		reason,
		created_at
		// file_name
	) => {
		console.log(id);
		updateID = id;
		setValues({
			...values,
			customer_name: customer_name,
			address: address,
			account_number: account_number,
			transaction_id: transaction_id,
			customer_id: customer_id,
			reason: reason,
			created_at: created_at,
			// file_name: file_name,
		});

		setOpenFileUploadCustomer(true);
	};
	const detailClicked = (
		id,
		customer_name,
		address,
		account_number,
		transaction_id,
		customer_id,
		reason,
		file_name,
		created_at
	) => {
		console.log(id);
		updateID = id;
		setValues({
			...values,
			customer_name: customer_name,
			address: address,
			account_number: account_number,
			transaction_id: transaction_id,
			customer_id: customer_id,
			reason: reason,
			file_name: file_name,
			created_at: created_at,
		});

		setOpenDetailCustomer(true);
	};

	const editStrCustomer = () => {
		if (values.customer_id.trim() === "") {
			setErrorMessage2("Please provide Customer ID");
			return;
		} else if (values.customer_name.trim() === "") {
			setErrorMessage2("Please provide Customer Name");
			return;
		} else if (values.transaction_id.trim() === "") {
			setErrorMessage2("Please provide Transaction Id");
			return;
		} else if (values.address.trim() === "") {
			setErrorMessage2("Please provide address");
			return;
		} else if (values.account_number.trim() === "") {
			setErrorMessage2("Account number length must be 16 digit.");
			return;
		} else if (values.account_number.length !== 16) {
			setErrorMessage2("Account number length must be 16 digit.");
			return;
		} else if (values.reason.trim() === "") {
			setErrorMessage2("Please provide reason");
			return;
		} else {
			axios
				.put(
					url + "/str/" + updateID,
					{
						customer_id: values.customer_id,
						customer_name: values.customer_name,
						address: values.address,
						transaction_id: values.transaction_id,

						account_number: values.account_number,
						reason: values.reason,
					},
					{ withCredentials: true }
				)
				.then((res) => {
					if (res.data.Status === "Success") {
						console.log(res.data);
						console.log("succeded");
					} else {
						console.log("Failed");
					}
				})
				.then(
					(data) => {
						alert("Customer Detail saved");
						window.location.reload(false);
					}

					// ,
					// (error) => {
					// 	alert("Connection to the server failed");
					// }
				)
				.catch((error) => {
					if (!error?.response) {
						setErrorMessage2("No Server Response");
					} else if (error?.code === AxiosError.ERR_NETWORK) {
						setErrorMessage2("Network Error");
					} else if (error.response?.status === 404) {
						setErrorMessage2("404 - Not Found");
					} else if (error?.code) {
						setErrorMessage2("Code: " + error.code);
					} else {
						setErrorMessage2("Unknown Error");
					}
				});
		}
		console.log(values.account_number);
		console.log(updateID);
	};
	const handleSubmitEdit = (event) => {
		event.preventDefault();
		editStrCustomer(); // Save  when form is submitted
	};

	const columns = [
		{
			name: "Customer Name",
			// selector: "customer_name",
			selector: (row) => row.customer_name,
		},
		{
			name: "Account Number",
			selector: (row) => row.account_number,
		},
		{
			name: "Transaction Id",
			selector: (row) => row.transaction_id,
		},
		{
			name: "ID Number",
			selector: (row) => row.customer_id,
		},
		{
			name: "created_at",
			selector: (row) => moment(row.created_at).fromNow(),
		},

		{
			name: "Upload File",
			cell: (row) => {
				const createdDate = moment().diff(moment(row.created_at), "hours");
				// new Date().getHours() - new Date(row.created_at).getHours();

				if (createdDate < 2) {
					return (
						<Button
							color="primary"
							onClick={() =>
								clickFileUpload(
									row.id,
									row.customer_name,
									row.address,
									row.account_number,
									row.transaction_id,
									row.customer_id
									// row.file_name
								)
							}
						>
							File Upload
						</Button>
					);
				}
				return `Upload Mode Disabled`;
			},
			ignoreRowClick: true,
			allowOverflow: true,
			button: true,
		},

		{
			name: "Edit",
			cell: (row) => {
				const createdDate = moment().diff(moment(row.created_at), "hours");

				if (createdDate < 2) {
					return (
						<Button
							color="primary"
							onClick={() =>
								editClicked(
									row.id,
									row.customer_name,
									row.address,
									row.account_number,
									row.transaction_id,
									row.customer_id,
									row.reason
								)
							}
						>
							<EditIcon style={{ fill: "#00094B" }} />
						</Button>
					);
				}
				return "Edit mode Disabled";
			},
			ignoreRowClick: true,
			allowOverflow: true,
			button: true,
		},

		/* 	{
			name: "Edit",
			cell: (row) =>
				row.id != null ? (
					<Button
						onClick={() =>
							editClicked(
								row.id,
								row.customer_name,
								row.address,
								row.account_number,
								row.transaction_id,
								row.customer_id,
								row.reason
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

		 */
		{
			name: "Detail",

			cell: (row) =>
				row.id != null ? (
					<Button
						color="primary"
						onClick={() =>
							detailClicked(
								row.id,
								row.customer_name,
								row.address,
								row.account_number,
								row.transaction_id,

								row.customer_id,
								row.reason,
								row.file_name
							)
						}
					>
						View
					</Button>
				) : (
					""
				),
			ignoreRowClick: true,
			allowOverflow: true,
			button: true,
		},
	];

	const searchTriggred = (event) => {
		event.preventDefault();
		setPaginationReset(true);

		searchInput = event.target.value;
		if (event.target.value.trim() != "") {
			searchRequested = true;
			getStrList();
		} else {
			searchRequested = false;

			searchInput = null;
			getStrList();
		}
		prevSearchInput = searchInput;
		console.log("search triggred with " + searchInput);
		// Save  when form is submitted
	};

	const click = (
		id,
		customer_name,
		address,
		account_number,
		transaction_id,
		customer_id,
		reason
	) => {
		myRefname.current.click();
		window.$updateId = id;
		window.$customer_name = customer_name;
		window.$customer_address = address;
		window.$account_number = account_number;
		window.$transaction_id = transaction_id;
		window.$customer_id = customer_id;
		window.$reason = reason;

		console.log(id + " " + transaction_id);
	};
	const getStrList = () => {
		setDataFetched(false);
		axios
			.get(
				`${url}/str/${page}/${countPerPage}/${searchInput}/${searchRequested}`,
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				if (res.data.authorized === false) {
					setAuthorized(false);
				}
				setDormantAccounts({});
				setTotalRowCount(res.data[res.data.length - 1].countRow);
				res.data.splice(countPerPage + 1, 1);
				report = res.data[res.data.length - 1].report;
				res.data.splice(countPerPage, 1);
				setPaginationReset(false);
				setDataFetched(true);
				setDormantAccounts(res);
			})
			.catch((err) => {
				setDormantAccounts({});
				setDataFetched(true);
			});
	};
	console.log(dormantAccounts);
	useEffect(() => {
		getStrList();
	}, [page]);

	return (
		<Page
			className={classes.root}
			title="Suspicious Transaction List "
			breadcrumbs={[{ name: "Forms", active: true }]}
		>
			{isLoggedIn ? (
				<Container>
					{!dataFetched ? <LinearProgress /> : ""}

					<Paper component="form" className={classes.paper}>
						<InputBase
							variant="outlined"
							className={classes.input}
							onChange={searchTriggred}
							placeholder="Suspicious Transaction List"
							inputProps={{ "aria-label": "search google maps" }}
						/>
						<IconButton className={classes.iconButton} aria-label="search">
							<SearchIcon />
						</IconButton>
						<Button
							style={{ marginLeft: "auto", float: "right" }}
							variant="outlined"
							color="primary"
							onClick={() => createSTRUser()}
						>
							<PersonAddIcon /> Register STR User
						</Button>
						{/* detail start */}
						<Dialog
							maxWidth="md"
							fullWidth
							open={openDetailCustomer}
							TransitionComponent={Transition}
							keepMounted
							onClose={handleCloseEdit}
							aria-describedby="alert-dialog-slide-description"
							aria-labelledby="form-dialog-title"
						>
							<MuiDialogTitle disableTypography>
								<Typography variant="h4">
									{"ST Customer Detail "} for {values.customer_name}
								</Typography>
							</MuiDialogTitle>
							{/* Detail STR Customer */}
							<DetailStrCustomer values={values} />
							<Box display="flex" justifyContent="flex-end" p={2}>
								<Button
									onClick={handleCloseEdit}
									variant="outlined"
									color="primary"
								>
									Close
								</Button>
							</Box>
						</Dialog>
						{/* detail end */}

						<Dialog
							open={openCreate}
							TransitionComponent={Transition}
							keepMounted
							onClose={handleClose}
							aria-labelledby="alert-dialog-slide-title"
							aria-describedby="alert-dialog-slide-description"
						>
							<DialogTitle id="alert-dialog-slide-title">
								{"Suspicious Transaction "}
							</DialogTitle>
							<DialogContent>
								<StrRegister />
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
								{"Edit ST Customer Detail "}for {values.customer_name} id is{" "}
								{updateID}
							</DialogTitle>
							<DialogContent>
								<form autoComplete="off" noValidate onSubmit={handleSubmitEdit}>
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

										<CardHeader title="Suspicious Transaction registration" />
										<Divider />
										<CardContent>
											<Grid container spacing={3}>
												<Grid item md={6} xs={12}>
													<TextField
														fullWidth
														label="Customer ID"
														name="customer_id"
														readOnly={false}
														onChange={handleChange}
														required
														//value={destination_branch}
														value={values.customer_id}
														variant="outlined"
													/>
												</Grid>
												<Grid item md={6} xs={12}>
													<TextField
														fullWidth
														label="Full Name"
														name="customer_name"
														readOnly={false}
														onChange={handleChange}
														required
														aria-label="minimum height"
														variant="outlined"
														value={values.customer_name}
													/>
												</Grid>
												<Grid item md={6} xs={12}>
													<TextField
														fullWidth
														label="Account Number"
														name="account_number"
														readOnly={false}
														onChange={handleChange}
														aria-label="minimum height"
														variant="outlined"
														value={values.account_number}
													/>
													<p>Account Length Should be 16 Long </p>
													<p>Current Length {values.account_number.length}</p>
												</Grid>
												<Grid item md={6} xs={12}>
													<TextField
														fullWidth
														label="Address"
														name="address"
														readOnly={false}
														onChange={handleChange}
														aria-label="minimum height"
														variant="outlined"
														value={values.address}
													/>
												</Grid>
												<Grid item md={6} xs={12}>
													<TextField
														fullWidth
														label="Transaction Id"
														name="transaction_id"
														readOnly={false}
														onChange={handleChange}
														aria-label="minimum height"
														variant="outlined"
														value={values.transaction_id}
													/>
												</Grid>
												<Grid item md={6} xs={12}>
													<TextField
														multiline
														rows={4}
														fullWidth
														label="Reason Of Suspicious"
														name="reason"
														readOnly={false}
														onChange={handleChange}
														aria-label="minimum height"
														variant="outlined"
														value={values.reason}
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
													onClick={handleCloseEdit}
													variant="outlined"
													color="primary"
												>
													Close
												</Button>
											</Grid>
											<Grid>
												<Button
													variant="outlined"
													color="primary"
													type="submit"
												>
													Update
												</Button>
											</Grid>
										</Box>
									</Card>
								</form>
							</DialogContent>
							<DialogActions></DialogActions>
						</Dialog>

						{/* File Upload */}

						<Dialog
							open={openFileUploadCustomer}
							TransitionComponent={Transition}
							keepMounted
							onClose={handleCloseEdit}
							aria-labelledby="alert-dialog-slide-title"
							aria-describedby="alert-dialog-slide-description"
						>
							<DialogTitle id="alert-dialog-slide-title">
								{"Suspicious Transaction Supported Documents "}
								{" For "}
								<Typography variant="h4">{values.customer_name}</Typography>
							</DialogTitle>
							<DialogContent>
								<FileUpload id={updateID} />

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
								</Box>
							</DialogContent>
							<DialogActions></DialogActions>
						</Dialog>
					</Paper>

					<DataTable
						title="Suspicious Transaction List"
						columns={columns}
						data={dormantAccounts.data}
						highlightOnHover
						paginationServer
						paginationTotalRows={totalRowCount}
						paginationPerPage={countPerPage}
						striped={true}
						hover={true}
						pagination={dataFetched}
						onClickRow={click}
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

export default StrList;
