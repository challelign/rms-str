import React, { useState, useEffect, useRef } from "react";
import {
	Grid,
	Container,
	Button,
	makeStyles,
	Paper,
	InputBase,
	IconButton,
} from "@material-ui/core";
import DataTable from "react-data-table-component";
// import Page from 'src/components/Page';
import Page from "../../../../components/Page";
import SearchIcon from "@material-ui/icons/Search";

import axios from "axios";
import Dormant from "./dormantList";
import Popup from "reactjs-popup";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { Navigate } from "react-router-dom";
import { url } from "../../../../url";
import LinearProgress from "@material-ui/core/LinearProgress";
window.$updateId = 0;
window.$customer_name = "Test Name";
window.$customer_address = "";
window.$isLogged = 0;
window.$dormant_customer_action = 0;
window.$dormant_reason = 0;
window.$dormant_remark = "";
window.$customer_contact_address = "";

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

const DormantCoustomerBelow100 = ({ values }) => {
	const [value, setValue] = React.useState("");
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
			title="Dormant Accounts Below 100 "
			breadcrumbs={[{ name: "Forms", active: true }]}
		>
			<Popup
				trigger={
					<div ref={myRefname}>
						<button style={{ visibility: "hidden" }} ref={myRefname} />
					</div>
				}
			>
				<Dormant />
			</Popup>

			{isLoggedIn ? (
				<Container>
					{!dataFetched ? <LinearProgress /> : ""}

					<Paper component="form" className={classes.paper}>
						<InputBase
							variant="outlined"
							className={classes.input}
							onChange={searchTriggred}
							placeholder="Search Dormant Accounts Below 100 ETB"
							inputProps={{ "aria-label": "search google maps" }}
						/>
						<IconButton className={classes.iconButton} aria-label="search">
							<SearchIcon />
						</IconButton>
					</Paper>

					<DataTable
						title="Dormant Accounts Below 100 ETB"
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

export default DormantCoustomerBelow100;
