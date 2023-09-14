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
import { AxiosError } from "axios";
import reasonOfSuspicious from "../constants/reasonOfSuspicious ";
// import typeofAccount from "../constants/typeofAccount";
import { CloudUpload as CloudUploadIcon } from "@material-ui/icons";

const StrRegister = (props) => {
	const [redirect, setRedirect] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [files, setFiles] = useState([]);
	const [isSaving, setIsSaving] = useState(false);

	const [values, setValues] = useState({
		customer_name: "",
		account_number: "",
		transaction_id: "",
		customer_id: "",
		// typeofAccount: "",
		reason: "",
		address: "",
	});
	const handleFileChange = (event) => {
		setFiles(event.target.files);
	};

	const saveCustomer = () => {
		// Create a FormData object

		const formData = new FormData();
		const allowedTypes = [
			// "application/pdf",
			"application/zip",
			// "image/jpeg",
			// "image/png",
			"application/x-rar-compressed",
			"application/x-zip-compressed",
		];

		for (let i = 0; i < files.length; i++) {
			// formData.append("files", files[i]);

			const file = files[i];
			if (!allowedTypes.includes(file.type)) {
				setErrorMessage("Invalid file type. Please select a  ZIP file only.");
				return;
			}
			formData.append("files", file);
			console.log("Files ==============>", file);
		}

		formData.append("customer_name", values.customer_name);
		formData.append("transaction_id", values.transaction_id);
		formData.append("customer_id", values.customer_id);
		// formData.append("typeofAccount", values.typeofAccount);
		formData.append("reason", values.reason);
		formData.append("address", values.address);
		formData.append("account_number", values.account_number);

		if (values.customer_id.trim() === "") {
			setErrorMessage("Please provide Customer ID");
		} else if (values.customer_name.trim() === "") {
			setErrorMessage("Please provide Account Holder Name");
		} else if (values.transaction_id.trim() === "") {
			setErrorMessage("Please provide Transaction Id");
		} else if (values.reason.trim() === "") {
			/* 	else if (values.typeofAccount.trim() === "") {
			setErrorMessage("Please Select Account type");
		}  */
			setErrorMessage("Please Select reason");
		} else if (values.address.trim() === "") {
			setErrorMessage("Please provide address");
		} else if (values.account_number.trim() === "") {
			setErrorMessage("Account number length must be 16 digit.");
		} else if (values.account_number.length !== 16) {
			setErrorMessage("Account number length must be 16 digit.");
		} else {
			setIsSaving(true);

			axios
				.post(url + "/str", formData, {
					withCredentials: true,
				})
				.then((res) => {
					if (res.data.status === "Success") {
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
					// 	console.log(formData);
					// }
				)
				.catch((error) => {
					if (!error?.response) {
						setErrorMessage("No Server Response");
					} else if (error?.code === AxiosError.ERR_NETWORK) {
						setErrorMessage("Network Error");
					} else if (error.response?.status === 404) {
						setErrorMessage("404 - Not Found");
					} else if (error?.code) {
						setErrorMessage("Code: " + error.code);
					} else {
						setErrorMessage("Unknown Error");
					}
				})
				.finally(() => {
					setIsSaving(false); // Set isSaving back to false to enable the submit button
				});
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
			enctype="multipart/form-data"
		>
			<Card>
				<CardHeader title="Suspicious Transaction registration (Upload ZIP File only) " />
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
								variant="outlined"
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								label="Account  Holder Name"
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

						{/* 	<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								label="Account Type"
								name="typeofAccount"
								onChange={handleChange}
								required
								select
								error={
									values.actions === -1
										? values.inputError
											? true
											: false
										: ""
								}
								SelectProps={{ native: true }}
								variant="outlined"
							>
								{typeofAccount.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</TextField>
						</Grid> */}
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
						{/* <Grid item md={6} xs={12}>
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
						</Grid> */}
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								label="Reason Of Suspicious"
								name="reason"
								onChange={handleChange}
								required
								select
								error={
									values.actions === -1
										? values.inputError
											? true
											: false
										: ""
								}
								SelectProps={{ native: true }}
								variant="outlined"
							>
								{reasonOfSuspicious.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</TextField>
						</Grid>
					</Grid>

					<CardHeader title="Supported Documents like Opening Form, Copy of ID , Trade License , TIN and more (ZIP file only) " />
					<Grid container spacing={2} alignItems="center">
						<Grid item>
							<input
								type="file"
								// accept="file/*"
								accept=".zip,application/zip"
								// multiple
								name="files"
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
									Upload File
								</Button>
							</label>
						</Grid>
						{/* <Grid item>
							<Typography variant="body1">
								{files.length} file selected
							</Typography>
						</Grid> */}
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
					</Grid>
				</CardContent>
				{errorMessage !== "" ? (
					<div className="error">
						<Alert severity="warning">{errorMessage}</Alert>
					</div>
				) : (
					""
				)}
				<Divider />
				<Box display="flex" justifyContent="flex-end" p={2}>
					<Button color="primary" variant="contained" type="submit">
						{isSaving ? "Saving..." : "Save details"}
					</Button>
				</Box>
			</Card>
		</form>
	);
};

export default StrRegister;
