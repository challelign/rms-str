import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { Formik } from "formik";
import { Navigate } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { url } from "../../url";
import { BatchUrl } from "../../batchExcuteURL";
import {
	Box,
	Button,
	Container,
	TextField,
	Typography,
	makeStyles,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
// import Page from 'components/Page';
import Page from "../../components/Page";

window.$branch = "";
window.$position = "";

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		height: "100%",
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3),
	},
}));

const LoginView = () => {
	const submitHandler = (e) => {
		e.preventDefault();
		Login(details);
		// console.log("login details are " + details.name, details.password);
		console.log("login details are " + details.name);
	};
	const [user, setUser] = useState({ name: "", email: "" });
	const [ResponseMessage, setResponseMessage] = useState("");
	const [details, setDetails] = useState({ name: "", password: "" });
	const [isLoggedIn, setAuthorized] = useState(false);
	const [BOResourceLogged, setBOResourceLogged] = useState(false);
	const [IBDLogged, setIBDLogged] = useState(false);
	const Login = (details) => {
		// console.log(details);

		if (details.name.trim() === "") {
			setResponseMessage("Please enter your username");
		} else if (details.password.trim() === "") {
			setResponseMessage("Please enter your password");
		} else {
			setResponseMessage("Loading");
			axios
				.post(
					url + "/login",
					{
						username: details.name,
						password: details.password,
					},
					{ withCredentials: true }
				)
				.then(
					(login) => {
						console.log(login.data);
						if (login.data.success) {
							localStorage.setItem("branch", login.data.branch);
							localStorage.setItem("position", login.data.position);
							localStorage.setItem("first_name", login.data.first_name);

							if (login.data.BOResourceLogged) {
								setBOResourceLogged(true);
							} else if (login.data.IBDLogged) {
								setIBDLogged(true);
							} else {
								setAuthorized(true);
							}
							setResponseMessage("Success");
						} else {
							setResponseMessage(login.data.msg);
						}
						/* */
					},
					(error) => {
						axios.post(BatchUrl, {}).then((login) => {
							/* */
						});

						setResponseMessage(
							"Connection to the server failed , please try again :)"
						);
					}
				);
		}
	};

	useEffect(() => {
		document.body.style.zoom = 0.95;
		axios.post(url + "/autorized", {}, { withCredentials: true }).then(
			(authorized) => {
				console.log("authorized opened");
				// console.log(authorized.data);
				if (authorized.data.authorized) {
					// console.log(authorized.data.authorized);
					localStorage.setItem("branch", authorized.data.branch);
					localStorage.setItem("position", authorized.data.position);
					localStorage.setItem("first_name", authorized.data.first_name);
					if (authorized.data.BOResourceLogged) {
						setBOResourceLogged(true);
					} else {
						setAuthorized(true);
					}
				}
				if (!authorized.data.authorized) {
					setAuthorized(false);
				}
				/* */
			},
			(error) => {
				axios.post(BatchUrl, {}).then((login) => {
					/* */
				});

				setResponseMessage(
					"Connection to the server failed , please try again :)"
				);
			}
		);
	}, []);
	const classes = useStyles();
	const navigate = useNavigate();

	return (
		<Page className={classes.root} title="Login">
			<Box
				display="flex"
				flexDirection="column"
				height="100%"
				justifyContent="center"
			>
				{BOResourceLogged ? (
					<Navigate to="/rms2/app/potential_customer_list" />
				) : IBDLogged ? (
					<Navigate to="/rms2/app/fcy" />
				) : (
					""
				)}
				{isLoggedIn ? <Navigate to="/rms2/app/customers" /> : ""}

				<Container maxWidth="sm">
					{ResponseMessage == "Loading" ? (
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<CircularProgress />
						</div>
					) : (
						""
					)}
					<Formik>
						{({
							errors,
							handleBlur,
							// handleChange,
							handleSubmit,
							isSubmitting,
							touched,
							values,
						}) => (
							<form onSubmit={submitHandler}>
								<Box mb={3}>
									<Typography
										style={{ textAlign: "center" }}
										color="textPrimary"
										variant="h2"
									>
										{ResponseMessage != "" ? (
											<div className="error">
												<Alert severity="warning">{ResponseMessage}</Alert>
											</div>
										) : (
											""
										)}
										<b>Sign in To ABAY- RMS OR STR</b>
									</Typography>
									<Typography
										style={{ textAlign: "center" }}
										color="primary"
										gutterBottom
										variant="h5"
									>
										Sign in with your existing abay ERP account
									</Typography>
								</Box>

								<TextField
									error={Boolean(touched.email && errors.email)}
									fullWidth
									helperText={touched.email && errors.email}
									label="Username"
									margin="normal"
									onBlur={handleBlur}
									// onChange={handleChange}
									type="text"
									id="name"
									onChange={(e) =>
										setDetails({ ...details, name: e.target.value })
									}
									value={details.name}
									variant="outlined"
								/>
								<TextField
									error={Boolean(touched.password && errors.password)}
									fullWidth
									helperText={touched.password && errors.password}
									label="Password"
									margin="normal"
									name="password"
									onBlur={handleBlur}
									// onChange={handleChange}
									type="password"
									id="password"
									onChange={(e) =>
										setDetails({ ...details, password: e.target.value })
									}
									value={details.password}
									variant="outlined"
								/>
								<Box my={2}>
									<Button
										color="primary"
										variant="contained"
										disabled={isSubmitting}
										fullWidth
										size="medium"
										type="submit"
									>
										Sign in now
									</Button>
								</Box>
							</form>
						)}
					</Formik>
				</Container>
			</Box>
		</Page>
	);
};

export default LoginView;
