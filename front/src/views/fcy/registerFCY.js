import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Grid,
	TextField,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { url } from "../../url";

const Fcy = (props) => {
	const [redirect, setRedirect] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [values, setValues] = useState({
		phone: "",
		full_name: "",
		account_number: "",
		credit_amount: "",
	});

	const saveCustomer = () => {
		if (values.phone.trim() === "") {
			setErrorMessage("Please provide phone number");
		} else if (values.full_name.trim() === "") {
			setErrorMessage("Please provide fcy customer name");
		} else if (
			values.account_number.trim() !== "" &&
			values.account_number.length != 16
		) {
			setErrorMessage("Account number length must be 16 digit.");
		} else {
			axios
				.post(
					url + "/fcy",
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
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		saveCustomer(); // Save  when form is submitted
	};
	const handleChange = (event) => {
		setValues({
			...values,
			[event.target.name]: event.target.value,
		});
	};

	useEffect(() => {}, []);

	return (
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
				<CardHeader title="FCY Customer registration" />
				<Divider />
				<CardContent>
					<Grid container spacing={3}>
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								label="Phone Number"
								name="phone"
								readOnly={false}
								onChange={handleChange}
								required
								//value={destination_branch}

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
								required
								aria-label="minimum height"
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
								aria-label="minimum height"
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
								aria-label="minimum height"
								variant="outlined"
							/>
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

export default Fcy;
