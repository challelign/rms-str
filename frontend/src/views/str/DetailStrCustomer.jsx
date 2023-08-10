import React, { useState, useEffect, useRef } from "react";
import {
	Grid,
	Container,
	Button,
	makeStyles,
	Paper,
	InputBase,
	IconButton,
	CardHeader,
	Divider,
	Box,
	Card,
	CardContent,
	TextField,
	Typography,
} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

const DetailStrCustomer = ({ values }) => {
	return (
		<div>
			<DialogContent>
				<DialogContent>
					<CardHeader title="Suspicious Transaction Detail" />
					<Divider />
					<CardContent>
						<Typography gutterBottom variant="h5" component="div">
							Customer Full Name
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{values.customer_name}
						</Typography>
						<Divider />

						<Typography gutterBottom variant="h5" component="div">
							Customer Account Number
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{values.account_number
								? values.account_number
								: "Account Number not registered "}
						</Typography>
						<Divider />

						<Typography gutterBottom variant="h5" component="div">
							Customer Address
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{values.address}
						</Typography>
						<Divider />

						<Typography gutterBottom variant="h5" component="div">
							Customer Transaction ID
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{values.transaction_id}
						</Typography>

						<Divider />
						<Typography gutterBottom variant="h5" component="div">
							Customer ID
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{values.customer_id}
						</Typography>
						<Divider />
						<Typography gutterBottom variant="h5" component="div">
							Reason For Suspicious
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{values.reason}
						</Typography>
					</CardContent>
					<Divider />
				</DialogContent>
			</DialogContent>
			<DialogActions></DialogActions>
		</div>
	);
};

export default DetailStrCustomer;
