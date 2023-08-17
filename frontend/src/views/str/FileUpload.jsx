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
			"application/x-rar-compressed",
			"application/x-zip-compressed",
			// 	"application/pdf",
			"application/zip",
			// 	"image/jpeg",
			// 	"image/png",
		];

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (!allowedTypes.includes(file.type)) {
				// alert(file.type);
				setErrorMessage("Invalid file type. Please select  ZIPfile.");
				return;
			}
			if (file === null) {
				setErrorMessage(" Please select   ZIP  file.");
				return;
			}
			console.log("Files ==============>", file.type);

			formData.append("files", file);
			console.log("Files ==============>", file.type);
		}

		if (files.length === 0) {
			setErrorMessage("No file selected. Please choose a file.");
			return;
		} else {
			try {
				// alert(id);
				axios
					.put(url + "/str/upload/" + id, formData, {
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
				<CardHeader title="Supported Documents like Opening Form, Copy of ID , Trade License , TIN and more (Upload ZIP file only) " />
				<Divider />
				<CardContent>
					{/* <p>{id}</p> */}
					<Grid container spacing={2} alignItems="center">
						<Grid item>
							<input
								type="file"
								// accept="file/*"
								accept=".zip,application/zip"
								// multiple
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
