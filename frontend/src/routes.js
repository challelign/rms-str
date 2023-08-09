import React from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import MainLayout from "./layouts/MainLayout";
import CustomerListView from "./views/customer/CustomerListView";
import LoginView from "./views/auth/LoginView";
import NotFoundView from "./views/errors/NotFoundView";
import ShareHoldersList from "./views/shareholders/shareholdersList";
import TopDepositorList from "./views/top_depositors/topDepositorsList";
import DormantCustomerListView from "./views/Dormant Accounts/dormant/DormantListView";
import Below500List from "./views/Below500Thousand/bowlow500/Below500List";
import PotentialCustomerStatus from "./views/potentialCustomer/potentialCustomersAndStatus";
import PotentialCustomerList from "./views/potentialCustomer/potentialCustomerList";
import LoggedUser from "./views/loggedUser/loggedUser";
import Fcy from "./views/fcy/fcyTransaction";
import DormantCoustomerBelow100 from "./views/Dormant Accounts/dormant/Below100";
import ProminentCustomer from "./views/prominentCustomer/ProminentCustomer";
import StrList from "./views/str/StrList";
const routes = [
	{
		path: "rms2/app",
		// path: '',

		element: <DashboardLayout />,
		children: [
			{ path: "prominent_customer_loan", element: <ProminentCustomer /> },
			{ path: "customers", element: <CustomerListView /> },
			{ path: "shareholders", element: <ShareHoldersList /> },
			{ path: "top_depositors", element: <TopDepositorList /> },
			{ path: "dormant_account", element: <DormantCustomerListView /> },
			{ path: "below_100_dormant", element: <DormantCoustomerBelow100 /> },
			{ path: "below_500_thusand", element: <Below500List /> },
			{ path: "fcy", element: <Fcy /> },
			{ path: "str", element: <StrList /> },
			{
				path: "potential_customer_status",
				element: <PotentialCustomerStatus />,
			},
			{ path: "potential_customer_list", element: <PotentialCustomerList /> },
			{ path: "logged_user", element: <LoggedUser /> },
			{ path: "*", element: <NotFoundView /> },
		],
	},
	{
		// path: 'rms2/',
		path: "/",

		element: <MainLayout />,
		children: [
			{ path: "rms2/login", element: <LoginView /> },
			{ path: "404", element: <NotFoundView /> },
			//  this navigation is original code
			// { path: '/', element: <Navigate to='/rms2/login' /> },
			{ path: "/", element: <Navigate to="/rms2/login" /> }, //custom route my me
			{ path: "*", element: <NotFoundView /> },
			// { path: '/chalie', element: <Chalie /> },
		],
	},
];

export default routes;
