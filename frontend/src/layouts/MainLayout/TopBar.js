import React from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import { AppBar, Toolbar, makeStyles } from "@material-ui/core";
// import logo from '../../../src/abay_logo.png';
import logo from "../../abay_logo.png";

const useStyles = makeStyles({
	root: {},
	toolbar: {
		height: 64,
	},
});

const TopBar = ({ className, ...rest }) => {
	const classes = useStyles();

	return (
		<AppBar className={clsx(classes.root, className)} elevation={1} {...rest}>
			<Toolbar className={classes.toolbar}>
				<RouterLink to="/rms2/login">
					<img src={logo} width="90" alt="Logo" />
				</RouterLink>
			</Toolbar>
		</AppBar>
	);
};

TopBar.propTypes = {
	className: PropTypes.string,
};

export default TopBar;
