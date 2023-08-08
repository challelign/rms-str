import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  makeStyles,
  Button,
  Typography,
  Divider,
  TextField
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';
import DataTable from 'react-data-table-component';
// import Page from 'src/components/Page';
import Page from '../../components/Page';

import { Navigate } from 'react-router-dom';
import { url } from '../../url';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';

import DialogTitle from '@material-ui/core/DialogTitle';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
var pageForSearch = 0;
var prevSearchInput = '';
var updateID;
var searchInput = null;
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const LoggedUser = ({}) => {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
    setLoadLeadingBranch(true);
  };
  const handleClickOpenUser = () => {
    setOpen(true);
    setLoadLeadingBranch(false);
  };

  const handleClose = () => {
    setOpen(false);
    setPage2(0);
    setPage3(0);
    console.log("close called");
  };

  const [openEdit, setOpenEdit] = React.useState(false);
  const [values, setValues] = useState({
    company_name: '',
    contact_person: '',
    organization_type: '',
    phone: '',
    address: '',
    action: -1,
    inputError: false,
    account_number: '',
    message: '',
    disabled: true,
    messageDisabled: true,
    labelError: false
  });

  const myRefname = useRef(null);

  const columns2 = [
    {
      name: 'Data shows Starting From 04/19/2021 till now',

      cell: row => (
        <div
          style={{
            position: 'absolute',
            left: '-130%',
            top: '68%',
            width: '100%',
            transform: 'translate(130%, -85%)'
          }}
        >
          {row.id ?   <ExpansionPanel

          >
            <ExpansionPanelSummary
              style={{
                width: '100%'
              }}
              expandIcon={<ExpandMoreIcon />}
            >
            {loadLeadingBranch ?  <Typography> {row.branch_name}</Typography> : <Typography> {row.name}{' from '}{row.branch_name}</Typography> }
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div id="row" style={{ width: '72vw', display: 'flex' }}>
                {' '}
                <Typography>
                  <Typography>
                    {'With '}
                    {row.Count} {' total Updates '}
                  </Typography>
                </Typography>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel> :''}
        </div>
      )
    }
  ];
  // `user_ID`, `customer_branch`, `customer_name`, `account_number`, `customer_contact`, `reason`, `remark`, `efforts`, `responded`, `created_at`, `updated_at`
  const columns = [
    {
      name:
        'You can search logged users by their Branch name, Branch code, Name and Date',

      cell: row => (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '100%',
            transform: 'translate(-50%, -100%)'
          }}
        >
        {row.id ? <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {row.name} {', '} {' from  '} {row.branch_name} {' on '}
                {row.created_at}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div id="row" style={{ width: '72vw', display: 'flex' }}>
                {' '}
                <Typography>
                  <Typography>
                    {'User Logged in and did '}
                    {row.potential_customer_count != 0
                      ? row.potential_customer_count +
                        ' Potential customer updates,'
                      : ''}{' '}
                    {row.shareholder_count != 0
                      ? row.shareholder_count + ' Shareholder updates,'
                      : ''}{' '}
                    {row.top_depositors_count != 0
                      ? row.top_depositors_count + ' Top depoitor updates,'
                      : ''}{' '}
                    {row.dormant_account_count != 0
                      ? row.dormant_account_count + ' Dormant account updates, '
                      : ''}
                    {row.big_withdrowal_count != 0
                      ? row.big_withdrowal_count + ' Big withdrowal updates,'
                      : ''}
                         {row.below_500_count != 0
                      ? row.below_500_count + ' Below 500,000 balance updates,'
                      : ''}
                    {row.big_withdrowal_count == 0 &&
                    row.potential_customer_count == 0 &&
                    row.shareholder_count == 0 &&
                    row.dormant_account_count == 0 &&
                    row.below_500_count == 0 &&
                    row.top_depositors_count == 0
                      ? ' Nothing. Just viewed.'
                      : ''}
                  </Typography>
                </Typography>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>: ''}
        </div>
      )
    }
  ];

  const classes = useStyles();
  const [paginationReset, setPaginationReset] = useState(false);
  const [
    paginationResetLeadingBranch,
    setPaginationResetLeadingBranch
  ] = useState(false);
  const [
    paginationResetLeadingUser,
    setPaginationResetLeadingUser

  ] = useState(false);
  const [loggedUsers, setLoggedUsers] = useState({});
  const [leadingBranch, setLeadingBranch] = useState({});
  const [leadingUser, setLeadingUser] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [loadLeadingBranch, setLoadLeadingBranch] = useState(false);
  const [loadLeadingUser, setLoadLeadingUser] = useState(false);
  const [page, setPage] = useState(0);
  const [date, setDate] = useState('');
  const [page2, setPage2] = useState(0);
  const [page3, setPage3] = useState(0);
  const [isLoggedIn, setAuthorized] = useState(true);
  const [totalRowCount, setTotalRowCount] = useState(1);
  const [totalRowCountLeadingBranch, setTotalRowCountLeadingBranch] = useState(
    1
  );
  const [totalRowCountLeadingUser, setTotalRowCountLeadingUser] = useState(
    1
  );
  const [dataFetched, setDataFetched] = useState(false);
  const [dataFetchedLeadingBranch, setDataFetchedLeadingBranch] = useState(
    false
  );
  const [dataFetchedLeadingUser, setDataFetchedLeadingUser] = useState(
    false
  );
  const countPerPage = 7;

  var searchRequested = false;


  const searchTriggred = event => {
    event.preventDefault();
    setPaginationReset(true);
     if(event.target.name!=="date" ){
       setDate("");
     }
    searchInput = event.target.value;
    if (event.target.value.trim() != '') {
      console.log('i am in true');
      searchRequested = true;
      getLoggedUser();
    } else {
      searchRequested = false;
      console.log('i am in false');
      searchInput = null;
      getLoggedUser();
    }
    prevSearchInput = searchInput;
    console.log('search triggred with ' + searchInput);
    // Save  when form is submitted
  };

  const getLeadingBranch = () => {
    setDataFetchedLeadingBranch(false);
    axios
      .get(
        `${url}/logged_user_leading_branch/all/${page2}/${countPerPage}/${searchInput}/${searchRequested}`,
        {
          withCredentials: true
        }
      )
      .then(res => {
        if (res.data.authorized == false) {
          setAuthorized(false);
        }
        setLeadingBranch({});
        setTotalRowCountLeadingBranch(res.data[res.data.length - 1].countRow);
        setDataFetchedLeadingBranch(true);
        setPaginationResetLeadingBranch(false);
        res.data.splice(countPerPage, 1);

        setLeadingBranch(res);
      })
      .catch(err => {
        setLeadingBranch({});
        setDataFetchedLeadingBranch(true);
      });
  };

  const getLeadingUser = () => {
    setDataFetchedLeadingUser(false);
    axios
      .get(
        `${url}/logged_user_leading_user/all/${page3}/${countPerPage}/${searchInput}/${searchRequested}`,
        {
          withCredentials: true
        }
      )
      .then(res => {
        if (res.data.authorized == false) {
          setAuthorized(false);
        }
        setLeadingUser({});
        setTotalRowCountLeadingUser(res.data[res.data.length - 1].countRow);
        setDataFetchedLeadingUser(true);
        setPaginationResetLeadingUser(false);
        res.data.splice(countPerPage, 1);

        setLeadingUser(res);
      })
      .catch(err => {
        setLeadingUser({});
        setDataFetchedLeadingUser(true);
      });
  };

  const getLoggedUser = () => {
    setDataFetched(false);
    axios
      .get(
        `${url}/logged_user/all/${page}/${countPerPage}/${searchInput}/${searchRequested}`,
        {
          withCredentials: true
        }
      )
      .then(res => {
        if (res.data.authorized == false) {
          setAuthorized(false);
        }
        setLoggedUsers({});
        setTotalRowCount(res.data[res.data.length - 1].countRow);
        setDataFetched(true);
        setPaginationReset(false);
        res.data.splice(countPerPage, 1);

        setLoggedUsers(res);
      })
      .catch(err => {
        setLoggedUsers({});
        setDataFetched(true);
      });
  };
const dateChange = (value) => {
  console.log("date is is "+value);
setDate(value);
searchTriggred(value);
};
  useEffect(() => {
    if (searchInput != null) {
      searchRequested = true;
    } else {
      searchRequested = false;
    }

    getLoggedUser();

  }, [page]);

  useEffect(() => {
    getLeadingUser();
  }, [page3]);
  useEffect(() => {
    getLeadingBranch();
  }, [page2]);


  return (
    <Page
      className={classes.root}
      title="Logged User"
      breadcrumbs={[{ name: 'Forms', active: true }]}
    >
      {isLoggedIn ? (
        <Container style={{ marginTop: 2 }}>
          <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
            {loadLeadingBranch ?   <DataTable
                title={
                  <Typography variant="h3" gutterBottom>
                    Actively Following Branches and their Rank
                  </Typography>
                }
                columns={columns2}
                data={leadingBranch.data}
                highlightOnHover
                pagination
                paginationServer
                paginationTotalRows={totalRowCountLeadingBranch}
                paginationPerPage={countPerPage}
                striped={true}
                hover={true}
                pagination={dataFetchedLeadingBranch}
                paginationResetDefaultPage={paginationResetLeadingBranch}
                onChangeRowsPerPage={perPage => 4}
                possibleNumberPerPage={[2, 3, 4, 5, 6]}
                paginationComponentOptions={{
                  noRowsPerPage: true
                }}

                   onChangePage={page2 => setPage2(page2 - 1)}
              />
                 : <DataTable
                   title={
                     <Typography variant="h3" gutterBottom>
                       Actively Following Branches and their Rank
                     </Typography>
                   }
                   columns={columns2}
                   data={leadingUser.data}
                   highlightOnHover
                   pagination
                   paginationServer
                   paginationTotalRows={totalRowCountLeadingUser}
                   paginationPerPage={countPerPage}
                   striped={true}
                   hover={true}
                   pagination={dataFetchedLeadingUser}
                   paginationResetDefaultPage={paginationResetLeadingUser}
                   onChangeRowsPerPage={perPage => 4}
                   possibleNumberPerPage={[2, 3, 4, 5, 6]}
                   paginationComponentOptions={{
                     noRowsPerPage: true
                   }}
                   onChangePage={page3 => setPage3(page3 - 1)}


                 />}
            </DialogTitle>
            <Divider />

            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          {!dataFetched ? <LinearProgress /> : ''}

          <DataTable
            title={
              <Paper component="form">
                {date!=="" ? <InputBase
                    className={classes.input}
                    onChange={searchTriggred}
                    name="searchInput"
                     value={date}

                    placeholder="Search Logged user"
                    inputProps={{ 'aria-label': 'search google maps' }}
                  /> :   <InputBase
                      className={classes.input}
                      onChange={searchTriggred}
                      name="searchInput"
                      placeholder="Search Logged user"
                      inputProps={{ 'aria-label': 'search google maps' }}
                    /> }

                <IconButton className={classes.iconButton} aria-label="search">
                  <SearchIcon />
                </IconButton>

                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>{' '}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleClickOpen}
                >
                  Leading Branches
                </Button>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>{' '}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleClickOpenUser}
                >
                  Leading Users
                </Button>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>{' '}
                  <br />  <TextField
                  id="date"
                  name="date"
                  type="date"
                  disableFuture
                  onChange={event => {
                           searchTriggred(event);
                           const { value } = event.target;
                           setDate(value);
                         }}
                //  onChange={e => dateChange(e.target.value)}
                  openTo="year"
                  className={classes.input}
                />
              </Paper>
            }
            columns={columns}
            data={loggedUsers.data}
            highlightOnHover
            pagination
            paginationServer
            paginationTotalRows={totalRowCount}
            paginationPerPage={countPerPage}
            striped={true}
            hover={true}
            pagination={dataFetched}
            paginationResetDefaultPage={paginationReset}
            onChangeRowsPerPage={perPage => 4}
            possibleNumberPerPage={[2, 3, 4, 5, 6]}
            paginationComponentOptions={{
              noRowsPerPage: true
            }}
            onChangePage={page => setPage(page - 1)}
          />
        </Container>
      ) : (
        <Navigate to="/rms2/login" />
      )}
    </Page>
  );
};

export default LoggedUser;
