import React, { useState } from "react";
import {
	Container,
	Grid,
	makeStyles,
	Button,
	Card,
	CardHeader,
	Divider,
	CardContent,
	Typography,
	Box,
} from "@material-ui/core";
import { CloudUpload as CloudUploadIcon } from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert/Alert";
import axios, { AxiosError } from "axios";
import { url } from "../../url";

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		minHeight: "100%",
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3),
	},
}));

const FileUpload = ({ id, values }) => {
	// alert(id);
	const classes = useStyles();
	const [files, setFiles] = useState({});
	const [errorMessage, setErrorMessage] = useState("");

	const handleFileChange = (event) => {
		setFiles(event.target.files);
	};

	const saveUploadFile = () => {
		// Create a FormData object

		const formData = new FormData();

		if (!files) {
			setErrorMessage("No File Selected!");
			return;
		}
		for (let i = 0; i < files.length; i++) {
			const fileExtension = files.name.split(".").pop().toLowerCase();
			const allowedExtensions = ["jpg", "png", "gif"];

			if (allowedExtensions.includes(fileExtension)) {
				setErrorMessage("The file type must be jpg, png, gif");
				return;
			} else {
				formData.append("files", files[i]);
			}
		}

		// if (files.length === 0) {
		// 	setErrorMessage(
		// 		`Please provide Supported documents for the ${values.customer_name}`
		// 	);
		// }
		if (!files) {
			setErrorMessage("No File Selected!");
			return;
		}
		// return;
		else {
			// alert(`data is ${files.length}`);
			console.log("file found");
			return;
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
				.then((data) => {
					alert("Customer Detail saved");
					window.location.reload(false);
				})
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
				});
		}

		console.log(formData);
	};

	const handleUpload = (event) => {
		event.preventDefault();
		saveUploadFile(); // Save  when form is submitted
	};
	return (
		<form
			autoComplete="off"
			noValidate
			// className={clsx(classes.root, className)}
			// {...rest}
			// onSubmit={handleSubmit}
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
				<CardHeader title="Adding Supporting Documents" />
				<Divider />
				<CardContent>
					<Grid container spacing={2} alignItems="center">
						<Grid item>
							<input
								type="file"
								accept="file/*"
								multiple
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
									{Array.from(files)
										.map((file) => file.name)
										.join(", ")}
									{/* {Array.from(files).map((file, index) => (
										<>
											<p key={file.name}>
												{index + 1} . {file.name}
												<br />
											</p>
										</>
									))} */}
								</Typography>
							)}
						</Grid>
					</Grid>
					<Grid item>
						<Button variant="contained" color="primary" onClick={handleUpload}>
							Upload
						</Button>
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
