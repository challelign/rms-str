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
import { AxiosError } from "axios";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

var deleteID;
var organization_nam = "";
var company = "";
var updateID;
var pro_pot_c_id = "";
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

const ProminentCustomer = ({}) => {
	const [open, setOpen] = React.useState(false);
	const [deleteConfirmOpen, setdeleteConfirmOpen] = React.useState(false);
	const [openEdit, setOpenEdit] = React.useState(false);
	const [openEditCustomer, setOpenEditPayment] = React.useState(false);
	const [openCreate, setOpenCreate] = React.useState(false);
	const [paginationReset, setPaginationReset] = useState(false);
	const [payment, setPayment] = useState({});
	const [values, setValues] = useState({
		organization_id: "",
		branch: "",
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
		prominent_potential_customers_id: "",
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
							editClicked(
								row.id,
								row.company_name,
								row.account_number,
								row.prominent_potential_customers_id
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
	const [potentialCustomers, setOrganizations] = useState({});
	const [errorMessage2, setErrorMessage2] = useState("");
	const [page, setPage] = useState(0);
	const [isLoggedIn, setAuthorized] = useState(true);
	const [totalRowCount, setTotalRowCount] = useState(1);
	const [dataFetched, setDataFetched] = useState(false);

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

		if (company_name === null || pro_pot_c_id === "") {
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
			// alert(company_name.company_name);
			// alert(company_name.id);
			// alert(pro_pot_c_id);
			// console.log("company_name, ", company_name.company_name);
			// console.log("company_id, ", company_name.id);
			// console.log("account_number ", values.account_number);
			// console.log("updateID ", updateID);
			let company_id;
			if (pro_pot_c_id >= 0) {
				company_id = pro_pot_c_id;
			}
			if (company_name.id != null) {
				company_id = company_name.id;
			}

			// alert(company_id);
			// return;
			axios
				.put(
					url + "/prominent_customer/" + updateID,
					{
						account_number: values.account_number,
						company_name: company_id,

						// company_name: company_name.company_name,
						// company_name: options.id,
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
		console.log("company_name, ", company_name.company_name);
		console.log("company_id, ", company_name.id);
		console.log("account_number ", values.account_number);
		console.log("updateID ", updateID);
	};

	const editClicked = (
		id,
		company_name,
		account_number,
		prominent_potential_customers_id
	) => {
		console.log("id of clicke item =>", id);
		console.log("company_name of clicke item =>", company_name);
		console.log(
			"prominent_potential_customers_id =>",
			prominent_potential_customers_id
		);
		updateID = id;
		company = company_name;
		pro_pot_c_id = prominent_potential_customers_id;
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
			prominent_potential_customers_id: prominent_potential_customers_id,
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
					// alert("Customer Detail Deleted");
					window.location.reload(false);
					alert(res.data.message);
					/* */
				}
				// (error) => {
				// 	axios.post(BatchUrl, {}).then((login) => {
				// 		/* */
				// 	});

				// 	alert("Connection to the server failed , please try again :)");
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
	};

	const getOrganizationList = () => {
		setDataFetched(false);
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
				console.log("potentialCustomers =>", potentialCustomers);
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
	console.log("potentialCustomers id =>", potentialCustomers);
	console.log("dataFetched id =>", dataFetched);
	useEffect(() => {
		axios
			.get(`${url}/potential_customers_distinct`, {
				withCredentials: true,
			})
			.then((response) => {
				// console.log("response", response);
				setOptions(response.data);
				console.log("potential_customers_distinct =>", response.data);
			});
	}, []);
	useEffect(() => {
		getOrganizationList();
	}, [page]);

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
						<PersonAddIcon /> Register Loan Follow-up
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
							{"Register Loan Follow-up Account"}
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
							{"Edit Loan Follow-up:"} {company}
							{/* {"id is "} {pro_pot_c_id} */}
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
												{/* <p> {potentialCustomers?.data?.id}</p> */}

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
													// onChange={(event, value) => {
													//   if (value.id === pro_pot_c_id) {
													//     // alert(pro_pot_c_id);
													//     setCompany_name(pro_pot_c_id);
													//   } else {
													//     setCompany_name(value);
													//     // alert(value.id);
													//   }
													// }}
													renderInput={(params) => (
														<TextField
															{...params}
															label="Search Company Name"
															variant="outlined"
															// value={company_name}
															required
														/>
													)}
												/>
											</Grid>

											<Grid item md={12} xs={12}>
												<TextField
													fullWidth
													label="Loan Account Number"
													name="account_number"
													readOnly={false}
													// onChange={(event) => setValues(event.target.value)}
													onChange={handleChange}
													value={values.account_number}
													required
													variant="outlined"
												/>
												<p>Loan Account Length Should be 16 Long </p>
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
								{errorMessage2 !== "" ? (
									<div className="error">
										<Alert severity="warning">{errorMessage2}</Alert>
									</div>
								) : (
									""
								)}
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
							placeholder="Search Loan Account"
							inputProps={{ "aria-label": "search google maps" }}
						/>
						<IconButton className={classes.iconButton} aria-label="search">
							<SearchIcon />
						</IconButton>
					</Paper>

					<DataTable
						title={"Customer Loan Follow-up "}
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

export default ProminentCustomer;
