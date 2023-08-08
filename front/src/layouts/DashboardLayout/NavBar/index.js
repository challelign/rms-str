import React, { useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { url } from "../../../url";
import { BatchUrl } from "../../../batchExcuteURL";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
} from "react-feather";
import NavItem from "./NavItem";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import MoneyOffIcon from "@material-ui/icons/MoneyOff";
import { Navigate } from "react-router-dom";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
const user = {
  avatar: "/static/images/avatars/avatar_6.png",
  jobTitle: "Senior Developer",
  name: "Katarina Smith",
};

const items = [
  {
    href: "/rms2/app/customers",
    icon: MoneyOffIcon,
    title: "Big Withdrowal",
    id: 0,
  },

  {
    href: "/rms2/app/prominent_customer_loan",
    icon: MonetizationOnIcon,
    title: "Loan Follow-up",
    id: 1.1,
  },
  {
    href: "/rms2/app/shareholders",
    icon: AccountBalanceIcon,
    title: "Shareholders",
    id: 1,
  },
  {
    href: "/rms2/app/top_depositors",
    icon: AccountBalanceWalletIcon,
    title: "Top Depositors",
    id: 2,
  },
  {
    href: "/rms2/app/dormant_account",
    icon: ShoppingBagIcon,
    title: "Dormant Account",
    id: 3,
  },
  {
    href: "/rms2/app/below_100_dormant",
    icon: AccountBoxIcon,
    title: "Below 100 Dormant",
    id: 4,
  },
  {
    href: "/rms2/app/below_500_thusand",
    icon: MoneyOffIcon,
    title: "Below 500 Thosand",
    id: 5,
  },
  {
    href: "/rms2/app/potential_customer_status",
    icon: UserIcon,
    title: "Potential Customer",
    id: 6,
  },
  {
    href: "/rms2/app/fcy",
    icon: AccountBalanceWalletIcon,
    title: "Money Transfer",
    id: 7,
  },

  {
    href: "/rms2/app/potential_customer_list",
    icon: UserIcon,
    title: "List of potential customer",
    id: 8,
  },
  {
    href: "/rms2/app/logged_user",
    icon: VisibilityIcon,
    title: "Logged Users",
    id: 9,
  },
  // {
  //   href: "/rms2/app/logged_user",
  //   icon: VisibilityIcon,
  //   title: "dormant 100 ",
  //   id: 10,
  // },

  /* {
    href: '/app/account',
    icon: UserIcon,
    title: 'Account'
  },
  {
    href: '/app/settings',
    icon: SettingsIcon,
    title: 'Settings'
  },
  {
    href: '/login',
    icon: LockIcon,
    title: 'Login'
  },
  {
    href: '/register',
    icon: UserPlusIcon,
    title: 'Register'
  },
  {
    href: '/404',
    icon: AlertCircleIcon,
    title: 'Error'
  }*/
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: "calc(100% - 64px)",
  },
  avatar: {
    cursor: "pointer",
    width: 64,
    height: 64,
  },
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const [navigate, setNavigation] = useState(false);
  const [BOResourceLogged, SetBOResourceLogged] = useState(false);
  const [IBDLogged, SetIBDLogged] = useState(false);
  const branch = localStorage.getItem("branch");
  const position = localStorage.getItem("position");

  useEffect(() => {
    document.body.style.zoom = 0.95;
    if (openMobile && onMobileClose) {
      onMobileClose();
    }

    isBOResourceLogged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const isBOResourceLogged = () => {
    console.log("called ,");

    axios.post(url + "/autorized", {}, { withCredentials: true }).then(
      (authorized) => {
        console.log("authorized opened");
        console.log(authorized.data);
        if (authorized.data.authorized) {
          SetBOResourceLogged(authorized.data.BOResourceLogged);
          SetIBDLogged(authorized.data.IBDLogged);
          console.log("bo logged " + authorized.data.BOResourceLogged);
          console.log("ibd logged" + authorized.data.IBDLogged);
        }
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

  const logout = () => {
    axios.post(url + "/logout", {}, { withCredentials: true }).then(
      (authorized) => {
        setNavigation(true);
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
  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        {navigate ? <Navigate to="/rms2/login" /> : ""}
        <Avatar className={classes.avatar} />
        <Typography
          style={{
            alignItems: "center",
            textAlignVertical: "center",
            textAlign: "center",
          }}
          className={classes.name}
          color="textPrimary"
          variant="h5"
        >
          {position}
        </Typography>
        <Typography
          style={{
            alignItems: "center",
            textAlignVertical: "center",
            textAlign: "center",
          }}
          color="textSecondary"
          variant="body2"
        >
          {branch}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        {BOResourceLogged ? (
          // main branch role
          <List>
            {items.map((item) =>
              item.id >= 8 ? (
                <NavItem
                  href={item.href}
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                />
              ) : (
                ""
              )
            )}
          </List>
        ) : IBDLogged ? (
          <List>
            {items.map((item) =>
              item.id === 7 ? (
                <NavItem
                  href={item.href}
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                />
              ) : (
                ""
              )
            )}
          </List>
        ) : (
          // Branch role
          <List>
            {items.map((item) =>
              item.id < 8 ? (
                <NavItem
                  href={item.href}
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                />
              ) : (
                ""
              )
            )}
          </List>
        )}
      </Box>
      <Box flexGrow={1} />
      <Box p={2} m={2} bgcolor="background.dark">
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            color="primary"
            component="a"
            variant="contained"
            onClick={logout}
          >
            Logout Here
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false,
};

export default NavBar;
