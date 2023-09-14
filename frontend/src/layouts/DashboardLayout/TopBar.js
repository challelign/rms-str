import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
	Avatar,
	AppBar,
	Badge,
	Box,
	Hidden,
	IconButton,
	Toolbar,
	makeStyles,
	Button,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import InputIcon from "@material-ui/icons/Input";
import logo from "../../../src/abay_logo.png";
import axios from "axios";
import { url } from "../../url";
import { BatchUrl } from "../../batchExcuteURL";
import { useHistory } from "react-router-dom";
const useStyles = makeStyles(() => ({
	root: {},
	avatar: {
		width: 60,
		height: 60,
	},
}));

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
	const classes = useStyles();
	const [notifications] = useState([]);
	const [navigate, setNavigation] = useState(false);

	const redirect = useNavigate();
	const first_name = localStorage.getItem("first_name");

	const logout = () => {
		axios.post(url + "/logout", {}, { withCredentials: true }).then(
			(authorized) => {
				setNavigation(true);
				localStorage.clear();
				redirect("/rms2/login");
				/* */
			},
			(error) => {
				axios.post(BatchUrl, {}).then((login) => {
					/* */
				});
				alert("Connection to the server failed , please try again :)");
			}
		);
	};
	return (
		<AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
			<Toolbar>
				<RouterLink to="/">
					<img src={logo} width="90" alt="Logo" />
				</RouterLink>
				<Box flexGrow={1} />
				<Hidden mdDown>
					<IconButton color="inherit">
						<Badge
							badgeContent={notifications.length}
							color="primary"
							variant="dot"
						>
							{/* <NotificationsIcon />  */}
							{first_name}
						</Badge>
					</IconButton>
					<IconButton color="inherit">
						<InputIcon onClick={logout} />
					</IconButton>
				</Hidden>
				<Hidden lgUp>
					<IconButton color="inherit" onClick={onMobileNavOpen}>
						<MenuIcon />
					</IconButton>
				</Hidden>
			</Toolbar>
		</AppBar>
	);
};

TopBar.propTypes = {
	className: PropTypes.string,
	onMobileNavOpen: PropTypes.func,
};

export default TopBar;
