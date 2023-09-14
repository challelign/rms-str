import React from "react";
import { Box, Container, Typography, makeStyles } from "@material-ui/core";
// import Page from 'src/components/Page';
import Page from "../../components/Page";

// import pageNotFound from '../../../src/page_not_found.jpg';
import pageNotFound from "../../page_not_found.jpg";

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		height: "100%",
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3),
	},
	image: {
		marginTop: 50,
		display: "inline-block",
		maxWidth: "100%",
		width: 560,
	},
}));

const NotFoundView = () => {
	const classes = useStyles();

	return (
		<Page className={classes.root} title="404">
			<Box
				display="flex"
				flexDirection="column"
				height="100%"
				justifyContent="center"
			>
				<Container maxWidth="md">
					<Typography align="center" color="textPrimary" variant="h1">
						404: The page you are looking for isn’t here
					</Typography>
					<Typography
						align="center"
						color="textPrimary"
						variant="subtitle2"
					></Typography>
					<Box textAlign="center">
						<img
							alt="page not here"
							className={classes.image}
							src={pageNotFound}
						/>
					</Box>
				</Container>
			</Box>
		</Page>
	);
};

export default NotFoundView;
