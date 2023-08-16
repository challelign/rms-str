// import React, { useState } from "react";
// import {
// 	Container,
// 	Grid,
// 	makeStyles,
// 	Button,
// 	Card,
// 	CardHeader,
// 	Divider,
// 	CardContent,
// 	Typography,
// 	Box,
// } from "@material-ui/core";
// import { CloudUpload as CloudUploadIcon } from "@material-ui/icons";
// import Alert from "@material-ui/lab/Alert/Alert";
// import axios, { AxiosError } from "axios";
// import { url } from "../../url";

// const useStyles = makeStyles((theme) => ({
// 	root: {
// 		backgroundColor: theme.palette.background.dark,
// 		minHeight: "100%",
// 		paddingBottom: theme.spacing(3),
// 		paddingTop: theme.spacing(3),
// 	},
// }));

// const FileUpload = ({ id, values }) => {
// 	// alert(id);
// 	const classes = useStyles();
// 	const [files, setFiles] = useState([]);
// 	const [errorMessage, setErrorMessage] = useState("");

// 	const handleFileChange = (event) => {
// 		const selectedFiles = event.target.files;
// 		setFiles(event.target.files);
// 	};

// 	const saveUploadFile = () => {
// 		const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]; // Add allowed file types here

// 		const invalidFiles = Array.from(files).filter(
// 			(file) => !allowedTypes.includes(file.type)
// 		);

// 		if (invalidFiles.length > 0) {
// 			setErrorMessage(
// 				"Invalid file type. Please upload files of type JPEG, PNG, or PDF."
// 			); // Set error message for invalid file types
// 		} else {
// 			setFiles(files);
// 			setErrorMessage("");
// 		}

// 		const formData = new FormData();
// 		for (let i = 0; i < files.length; i++) {
// 			formData.append("files", files[i]);
// 		}

// 		if (files.length === 0) {
// 			alert("file found");
// 		}
// 		if (files === null) {
// 			setErrorMessage(
// 				`Please provide Supported documents for the ${values.customer_name}`
// 			);
// 		} else {
// 			return;
// 			axios
// 				.post(url + "/str", formData, {
// 					withCredentials: true,
// 				})
// 				.then((res) => {
// 					if (res.data.status === "Success") {
// 						console.log(res.data);
// 						console.log("succeded");
// 					} else {
// 						console.log("Failed");
// 					}
// 				})
// 				.then((data) => {
// 					alert("Customer Detail saved");
// 					window.location.reload(false);
// 				})
// 				.catch((error) => {
// 					if (!error?.response) {
// 						setErrorMessage("No Server Response");
// 					} else if (error?.code === AxiosError.ERR_NETWORK) {
// 						setErrorMessage("Network Error");
// 					} else if (error.response?.status === 404) {
// 						setErrorMessage("404 - Not Found");
// 					} else if (error?.code) {
// 						setErrorMessage("Code: " + error.code);
// 					} else {
// 						setErrorMessage("Unknown Error");
// 					}
// 				});
// 		}

// 		console.log(formData);
// 	};

// 	const handleSubmit = (event) => {
// 		event.preventDefault();
// 		saveUploadFile(); // Save  when form is submitted
// 	};
// 	return (
// 		<form
// 			autoComplete="off"
// 			noValidate
// 			// className={clsx(classes.root, className)}
// 			// {...rest}
// 			onSubmit={handleSubmit}
// 			enctype="multipart/form-data"
// 		>
// 			<Card>
// 				{errorMessage !== "" ? (
// 					<div className="error">
// 						<Alert severity="warning">{errorMessage}</Alert>
// 					</div>
// 				) : (
// 					""
// 				)}
// 				<CardHeader title="Suspicious Transaction registration" />
// 				<Divider />
// 				<CardContent>
// 					<Grid container spacing={2} alignItems="center">
// 						<Grid item>
// 							<input
// 								type="file"
// 								accept="file/*"
// 								multiple
// 								name="files"
// 								onChange={handleFileChange}
// 								style={{ display: "none" }}
// 								id="file-upload"
// 							/>
// 							<label htmlFor="file-upload">
// 								<Button
// 									variant="contained"
// 									color="primary"
// 									component="span"
// 									startIcon={<CloudUploadIcon />}
// 								>
// 									Upload Files
// 								</Button>
// 							</label>
// 						</Grid>
// 						<Grid item>
// 							<Typography variant="body1">
// 								{files.length} file(s) selected
// 							</Typography>
// 						</Grid>
// 						<Grid item>
// 							{files.length > 0 && (
// 								<Typography variant="body1">
// 									{Array.from(files).map((file, index) => (
// 										<>
// 											<p key={file.name}>
// 												{index + 1} . {file.name}
// 												<br />
// 											</p>
// 										</>
// 									))}
// 								</Typography>
// 							)}
// 						</Grid>
// 					</Grid>
// 				</CardContent>

// 				<Divider />
// 				<Box display="flex" justifyContent="flex-end" p={2}>
// 					<Button color="primary" variant="contained" type="submit">
// 						Save details
// 					</Button>
// 				</Box>
// 			</Card>
// 		</form>
// 	);
// };

// export default FileUpload;
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
	Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { url } from "../../url";
import { AxiosError } from "axios";

const FileUpload = ({ id, values }) => {
	const [errorMessage, setErrorMessage] = useState("");
	const [files, setFiles] = useState([]);

	const handleFileChange = (e) => {
		setFiles(e.target.files);
	};
	const saveFileUpload = () => {
		const formData = new FormData();
		const allowedTypes = [
			"application/pdf",
			"application/zip",
			"image/jpeg",
			"image/png",
		];

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (!allowedTypes.includes(file.type)) {
				setErrorMessage(
					"Invalid file type. Please select a PDF, ZIP, JPEG, or PNG file."
				);
				return;
			}
			if (file === null) {
				setErrorMessage(" Please select a PDF, ZIP, JPEG, or PNG file.");
				return;
			}
			formData.append("files", file);
			// console.log("Files ==============>", file);
		}

		if (files.length === 0) {
			setErrorMessage("No file selected. Please choose a file.");
			return;
		} else {
			try {
				// alert(id);
				axios
					.post(url + "/str/" + id, formData, {
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
					.then((data) => {
						alert("Customer supported Document saved");
						window.location.reload(false);
					})
					.catch((error) => {
						if (!error?.response) {
							setErrorMessage("No Server Response");
						} else if (error?.code === AxiosError.ERR_NETWORK) {
							setErrorMessage("Network Error");
						} else if (error.response?.status === 404) {
							setErrorMessage("404 - URL Not Found");
						} else if (error?.code) {
							setErrorMessage("Code: " + error.code);
						} else {
							setErrorMessage("Unknown Error");
						}
					});
			} catch (error) {
				console.error(error.message);
			}
		}
	};

	const handleFileSubmit = (event) => {
		event.preventDefault();
		saveFileUpload(); // Save  when form is submitted
	};

	return (
		<form
			autoComplete="off"
			noValidate
			// className={clsx(classes.root, className)}
			// {...rest}
			onSubmit={handleFileSubmit}
			enctype="multipart/form-data"
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
					{/* <p>{id}</p> */}
					<Grid container spacing={2} alignItems="center">
						<Grid item>
							<input
								type="file"
								accept="file/*"
								multiple
								name="files"
								onChange={handleFileChange}
								id="file-upload"
							/>
						</Grid>
						<Grid item key={id}>
							<Typography variant="body1">
								{files.length} file(s) selected
							</Typography>
						</Grid>

						{files.length > 0 && (
							<Typography variant="body1">
								Selected files:
								{/* {Array.from(files)
										.map((file) => file.name)
										.join(", ")} */}
								{Array.from(files).map((file, index) => (
									<Grid item key={file.name}>
										<br />
										<Typography>
											{index + 1} . {file.name}
										</Typography>
									</Grid>
								))}
							</Typography>
						)}
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

export default FileUpload;
