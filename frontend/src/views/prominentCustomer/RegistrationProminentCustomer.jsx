import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { AxiosError } from "axios";

import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	DialogActions,
	Divider,
	Grid,
	TextField,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { url } from "../../url";

const RegistrationProminentCustomer = (props) => {
	const [open, setOpen] = React.useState(false);

	const [redirect, setRedirect] = useState(false);

	const [account_number, setaAcount_number] = useState("");

	const [company_name, setCompany_name] = useState(null);

	const [options, setOptions] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");

	const saveCustomer = () => {
		if (company_name === null) {
			setErrorMessage("Please provide company name");
			return;
		} else if (account_number.trim() === "") {
			setErrorMessage("Account number length must be 16 digit.");
			return;
		} else if (account_number.length !== 16) {
			setErrorMessage("Account number length must be 16 digit.");
		} else {
			// alert(
			//   "account_number =>",
			//   account_number,
			//   "company_name=>",
			//   company_name.id
			// );
			axios
				.post(
					url + "/prominent_customer",
					{
						account_number: account_number,
						// company_name: company_name.company_name,
						company_name: company_name.id,
					},
					{ withCredentials: true }
				)

				.then(
					(res) => {
						// alert("Customer Detail Deleted");
						window.location.reload(false);
						alert(res.data.message);
						// setErrorMessage(res.data.message);
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
						setErrorMessage("No Server Response");
					} else if (error?.code === AxiosError.ERR_NETWORK) {
						setErrorMessage("Network Error");
					} else if (error.response?.status === 404) {
						setErrorMessage("404 - Not Found");
					}
					// i custom 400 error code to the backend
					else if (error.response?.status === 400) {
						setErrorMessage("Account number already exists");
					} else if (error?.code) {
						setErrorMessage("Code: " + error.code);
					} else {
						setErrorMessage("Unknown Error");
					}
				});
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		saveCustomer();
	};

	useEffect(() => {
		// axios.get(baseURL).then((response) => {
		//   setOptions(response.data);
		// });
		// axios.post(url + "/prominent_customer");

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

	return (
		<form autoComplete="off" noValidate onSubmit={handleSubmit}>
			<Card>
				{errorMessage != "" ? (
					<div className="error">
						<Alert severity="warning">{errorMessage}</Alert>
					</div>
				) : (
					""
				)}
				<CardHeader title="Register Loan Follow-up " />
				<Divider />

				<CardContent>
					<Grid container spacing={3}>
						<Grid item md={12} xs={12}>
							{/* <p>{JSON.stringify(options)}</p> */}
							<Autocomplete
								fullWidth
								required
								select="true"
								// multiple
								// limitTags={2}
								disablePortal
								id="combo-box-demo"
								options={options}
								// onChange={(e, v) => setRowdata(v)}
								// onChange={handleChange}
								// defaultValue={[
								//   options[13],
								//   options[12],
								//   options[11],
								// ]}
								getOptionLabel={(options) => options.company_name || ""}
								onChange={(event, newValue) => {
									setCompany_name(newValue);
								}}
								value={options.id}
								sx={{ width: 700 }}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Search Company Name"
										variant="outlined"
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
								required
								value={account_number}
								// onChange={handleChange}
								onChange={(event) => setaAcount_number(event.target.value)}
								aria-label="minimum height"
								variant="outlined"
							/>
							<p>Account Length Should be 16 Long </p>
							<p>Current Length {account_number.length}</p>
							{/* <p>Current Length {account_number}</p> */}
						</Grid>

						<Grid item md={6} xs={12}></Grid>
					</Grid>
				</CardContent>
				<Divider />
				<Box display="flex" justifyContent="flex-end" p={2}>
					<Button color="primary" variant="contained" type="submit">
						Save details
					</Button>
				</Box>
			</Card>
		</form>
	);
};

export default RegistrationProminentCustomer;
