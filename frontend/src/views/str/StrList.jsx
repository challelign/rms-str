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
} from "@material-ui/core";
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

import { url } from "../../url";
import StrRegister from "./StrRegister";
window.$updateId = 0;
window.$customer_name = "Test Name";
window.$customer_address = "";
window.$isLogged = 0;
window.$dormant_customer_action = 0;
window.$dormant_reason = 0;
window.$dormant_remark = "";
window.$customer_contact_address = "";

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
		full_name: "",
		transaction_id: "",
		user_id: "",
		reason: "",
		address: "",
		doc_file: "",
		account_number: "",
		//
		organization_id: "",

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
	const [openCreate, setOpenCreate] = useState(false);
	const [open, setOpen] = React.useState(false);
	const [deleteConfirmOpen, setdeleteConfirmOpen] = React.useState(false);
	const createSTRUser = () => {
		setOpenCreate(true);
	};
	const handleClose = () => {
		setOpen(false);
		setdeleteConfirmOpen(false);
		// setOpenEdit(false);
		setOpenCreate(false);
		// setLoadPayment(false);
	};
	const myRefname = useRef(null);
	// `user_ID`, `customer_branch`, `customer_name`, `account_number`, `customer_contact`, `reason`, `remark`, `efforts`, `responded`, `created_at`, `updated_at`
	const columns = [
		{
			name: "Customer Name",
			selector: "customer_name",
		},
		{
			name: "Account Number",
			selector: "account_number",
		},

		{
			name: "Status on reason update",

			cell: (row) =>
				row.responded === 1 ? (
					<CheckIcon style={{ fill: "green" }} />
				) : row.responded === 0 ? (
					<ClearIcon style={{ fill: "red" }} />
				) : (
					""
				),

			ignoreRowClick: true,
			allowOverflow: true,
			button: true,
		},

		{
			name: "Action",

			cell: (row) =>
				row.id != null ? (
					<Button
						color="primary"
						onClick={() =>
							click(
								row.id,
								row.customer_name,
								row.action,
								row.reason,
								row.remark,
								row.customer_contact,
								row.other_reason
							)
						}
					>
						Reason
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
	const [dormantAccounts, setDormantAccounts] = useState({});
	const [page, setPage] = useState(0);
	const [isLoggedIn, setAuthorized] = useState(true);
	const [totalRowCount, setTotalRowCount] = useState(1);
	const [dataFetched, setDataFetched] = useState(false);
	const countPerPage = 6;
	const handleChange = (state) => {
		// You can use setState or dispatch with something like Redux so we can use the retrieved data
		console.log("Selected Rows: ", state.selectedRows);
	};
	function handleChanges(newValue) {
		setValue(newValue);
	}

	const [paginationReset, setPaginationReset] = useState(false);

	const searchTriggred = (event) => {
		event.preventDefault();
		setPaginationReset(true);

		searchInput = event.target.value;
		if (event.target.value.trim() != "") {
			searchRequested = true;
			getDormantAccountsList();
		} else {
			searchRequested = false;

			searchInput = null;
			getDormantAccountsList();
		}
		prevSearchInput = searchInput;
		console.log("search triggred with " + searchInput);
		// Save  when form is submitted
	};

	const click = (id, name, action, reason, remark, phone, o_reason) => {
		myRefname.current.click();
		window.$updateId = id;
		window.$customer_name = name;
		console.log(id + " " + name);
		window.$dormant_customer_action = action;
		window.$dormant_reason = reason;
		window.$dormant_remark = remark;
		window.$customer_contact_address = phone;
		window.$other_reason = o_reason;
	};
	const getDormantAccountsList = () => {
		setDataFetched(false);
		axios
			.get(
				// `${url}/dormants-account-below-one-hundred/all/${page}/${countPerPage}`,
				// `${url}/dormants-account-below-one-hundred/all/${page}/${countPerPage}/${searchInput}/${searchRequested}`,
				`${url}/dormants-account-below-one-hundred/all/${page}/${countPerPage}/${searchInput}/${searchRequested}`,
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				if (res.data.authorized == false) {
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

	useEffect(() => {
		getDormantAccountsList();
	}, [page]);

	return (
		<Page
			className={classes.root}
			title="Suspicious Transaction List "
			breadcrumbs={[{ name: "Forms", active: true }]}
		>
			<Popup
				trigger={
					<div ref={myRefname}>
						<button style={{ visibility: "hidden" }} ref={myRefname} />
					</div>
				}
			>
				<FileUpload />
			</Popup>

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
								{"Suspicious Transaction "}
							</DialogTitle>
							{/* FCY component  */}
							<DialogContent>
								<StrRegister />
							</DialogContent>

							<DialogActions>
								<Button onClick={handleClose} color="primary">
									No cancel
								</Button>
							</DialogActions>
						</Dialog>
					</Paper>

					<DataTable
						title="Suspicious Transaction List"
						columns={columns}
						data={dormantAccounts.data}
						highlightOnHover
						pagination
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
