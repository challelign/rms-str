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

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		minHeight: "100%",
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3),
	},
}));

const FileUpload = ({ id }) => {
	// alert(id);
	const classes = useStyles();
	const [files, setFiles] = useState([]);
	const handleFileChange = (event) => {
		// setFiles(event.target.files);
		const uploadedFiles = Array.from(event.target.files);
		setFiles(uploadedFiles);
	};
	const handleSubmit = (event) => {
		event.preventDefault();
		// saveCustomer(); // Save  when form is submitted
	};
	return (
		<form autoComplete="off" noValidate onSubmit={handleSubmit}>
			<Card>
				<CardHeader title="Suspicious Transaction Supporting documents Upload" />
				<Divider />
				<CardContent>
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
