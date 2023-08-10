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
	TextareaAutosize,
	Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { url } from "../../url";
import { CloudUpload as CloudUploadIcon } from "@material-ui/icons";

const StrRegister = (props) => {
	const [redirect, setRedirect] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [files, setFiles] = useState([]);

	const [values, setValues] = useState({
		customer_name: "",
		account_number: "",
		transaction_id: "",
		customer_id: "",
		reason: "",
		address: "",
	});
	const handleFileChange = (event) => {
		// setFiles(event.target.files);
		const uploadedFiles = Array.from(event.target.files);
		setFiles(uploadedFiles);
	};

	const saveCustomer = () => {
		// Create a FormData object

		const formData = new FormData();
		// formData.append("customer_name", values.customer_name);
		// formData.append("transaction_id", values.transaction_id);
		// formData.append("customer_id", values.customer_id);
		// formData.append("reason", values.reason);
		// formData.append("address", values.address);
		// formData.append("account_number", values.account_number);

		files.forEach((file, index) => {
			formData.append(`file${index}`, file);
		});

		if (values.customer_id.trim() === "") {
			setErrorMessage("Please provide Customer ID");
		} else if (values.customer_name.trim() === "") {
			setErrorMessage("Please provide Customer Name");
		} else if (values.transaction_id.trim() === "") {
			setErrorMessage("Please provide Transaction Id");
		} else if (values.reason.trim() === "") {
			setErrorMessage("Please provide reason");
		} else if (values.address.trim() === "") {
			setErrorMessage("Please provide address");
		} else if (values.account_number.trim() === "") {
			setErrorMessage("Account number length must be 16 digit.");
		} else if (values.account_number.length !== 16) {
			setErrorMessage("Account number length must be 16 digit.");
		} else {
			axios
				.post(
					url + "/str",
					{
						customer_id: values.customer_id,
						customer_name: values.customer_name,
						address: values.address,
						transaction_id: values.transaction_id,
						reason: values.reason,
						account_number: values.account_number,
						files: formData,
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
						window.location.reload(false);

						/* */
					},
					(error) => {
						alert("Connection to the server failed");
						console.log(formData);
					}
				);
		}

		console.log(formData);
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
				{errorMessage !== "" ? (
					<div className="error">
						<Alert severity="warning">{errorMessage}</Alert>
					</div>
				) : (
					""
				)}
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
							/>
						</Grid>
						<Grid item md={6} xs={12}></Grid>
					</Grid>
					<Grid container spacing={2} alignItems="center">
						<Grid item>
							<input
								type="file"
								accept="file/*"
								multiple
								name={files}
								onChange={handleFileChange}
								style={{ display: "none" }}
								id="file-upload"
							/>
							<label htmlFor="file-upload">
								<Button
									variant="contained"
									color="primary"
									component="span"
									startIcon={<CloudUploadIcon />}
								>
									Upload Files
								</Button>
							</label>
						</Grid>
						<Grid item>
							<Typography variant="body1">
								{files.length} file(s) selected
							</Typography>
						</Grid>
						<Grid item>
							{files.length > 0 && (
								<Typography variant="body1">
									Selected files:
									{/* {Array.from(files)
										.map((file) => file.name)
										.join(", ")} */}
									{Array.from(files).map((file, index) => (
										<>
											<p key={file.name}>
												{index + 1} . {file.name}
												<br />
											</p>
										</>
									))}
								</Typography>
							)}
						</Grid>
						{/* <Grid item>
							<Button
								variant="contained"
								color="primary"
								onClick={handleUpload}
							>
								Upload
							</Button>
						</Grid> */}
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

export default StrRegister;
