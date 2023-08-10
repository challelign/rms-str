import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
	Avatar,
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	CardHeader,
	CardMedia,
	Divider,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
	makeStyles,
} from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
const useStyles = makeStyles(() => ({
	root: {},
	avatar: {
		height: 100,
		width: 100,
	},
}));

const Profile = ({ className, ...rest }) => {
	const classes = useStyles();
	const customer_name = window.$customer_name;
	const account_number = window.$account_number;
	const address = window.$customer_address;
	const transaction_id = window.$transaction_id;
	const customer_id = window.$customer_id;
	const reason = window.$reason;
	const closeWindow = () => {
		document.getElementById("four").style.display = "none";
	};
	return (
		<>
			<Card>
				<Button
					color="primary"
					style={{ marginLeft: "auto", float: "right" }}
					onClick={closeWindow}
				>
					Close Window
				</Button>
				<CardHeader
					subheader="What was customer's response ? and the issue occured for making big withdrowal?"
					title="Customers Response"
				/>
				<CardContent
					style={{
						alignItems: "center",
						textAlignVertical: "center",
						textAlign: "center",
					}}
				>
					<Box
						alignItems="center"
						display="flex"
						flexDirection="column"
						// paddingLeft="10"
					>
						<Avatar />
						<Typography
							color="textPrimary"
							gutterBottom
							variant="h5"
							text-align="center"
						>
							{customer_name}
						</Typography>
						<Typography color="textSecondary" variant="body1">
							{` Address :${address} ${""}`}
						</Typography>
						<Typography
							className={classes.dateText}
							color="textSecondary"
							variant="body1"
						>
							<span className="" variant="body1">
								Account Number:
							</span>
							{account_number}
						</Typography>
					</Box>
				</CardContent>
				<Divider />
			</Card>
		</>
	);
};

Profile.propTypes = {
	className: PropTypes.string,
};

export default Profile;
