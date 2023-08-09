import React, { useState, useEffect, useRef } from 'react';
import { Container, Button, makeStyles } from '@material-ui/core';
import DataTable from 'react-data-table-component';
// import Page from 'src/components/Page';
import Page from '../../../components/Page';
import axios from 'axios';
import Popup from 'reactjs-popup';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import Account from '../../account/ShareholderReason';
import { Navigate } from 'react-router-dom';
import { url } from '../../../url';
import LinearProgress from '@material-ui/core/LinearProgress';
//global variables
window.$shareholder_updateId = 0;
window.$shareholder_name = '';
window.$shareholder_address = '';
window.$shareholder_action = 0;
window.$shareholder_reason = 0;
window.$shareholder_efforts = '';
window.$shareholder_remark = '';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const ShareHoldersList = ({ values }) => {
  const [value, setValue] = React.useState('');
  const myRefname = useRef(null);
  const columns = [
    {
      name: 'Account Number',
      selector: 'sh_account_no',
    },
    {
      name: 'Number of shares',
      selector: 'no_of_shares',
    },

    {
      name: 'share holder deposit',
      selector: 'sh_deposit',
    },

    {
      name: 'Status on  update',

      cell: (row) =>
        row.responded === 1 ? (
          <CheckIcon style={{ fill: 'green' }} />
        ) : row.responded === 0 ? (
          <ClearIcon style={{ fill: 'red' }} />
        ) : (
          ''
        ),

      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },

    {
      name: 'Action',

      cell: (row) =>
        row.id != null ? (
          <Button
            color='primary'
            onClick={() =>
              click(
                row.id,
                row.sh_name,
                row.sh_address,
                row.action,
                row.reason,
                row.efforts,
                row.remark
              )
            }
          >
            Status
          </Button>
        ) : (
          ''
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const classes = useStyles();
  const [users, setUsers] = useState({});
  const [page, setPage] = useState(0);
  const [isLoggedIn, setAuthorized] = useState(true);
  const [totalRowCount, setTotalRowCount] = useState(1);
  const [dataFetched, setDataFetched] = useState(false);
  const countPerPage = 6;
  const handleChange = (state) => {
    // You can use setState or dispatch with something like Redux so we can use the retrieved data
    console.log('Selected Rows: ', state.selectedRows);
  };

  function handleChanges(newValue) {
    setValue(newValue);
  }
  const click = (id, name, address, action, reason, efforts, remark) => {
    myRefname.current.click();
    window.$shareholder_updateId = id;
    window.$shareholder_name = name;
    window.$shareholder_address = address;
    window.$shareholder_action = action;
    window.$shareholder_reason = reason;
    window.$shareholder_efforts = efforts;
    window.$shareholder_remark = remark;
  };
  const getUserList = () => {
    setDataFetched(false);
    console.log(page);
    console.log(countPerPage);
    axios
      .get(`${url}/shareholder/all/${page}/${countPerPage}`, {
        withCredentials: true,
      })
      .then((res) => {
        //console.log("users" + res.data.user);
        setUsers({});
        if (res.data.authorized == false) {
          setAuthorized(false);
        }
        setTotalRowCount(res.data[res.data.length - 1].countRow);

        res.data.splice(countPerPage, 1);

        setUsers(res);
        setDataFetched(true);

        // ;
      })
      .catch((err) => {
        setUsers({});
        setDataFetched(true);
      });
  };

  useEffect(() => {
    getUserList();
  }, [page]);

  return (
    <Page
      className={classes.root}
      title='Shareholders'
      breadcrumbs={[{ name: 'Forms', active: true }]}
    >
      <Popup
        trigger={
          <div ref={myRefname}>
            <Button ref={myRefname}></Button>
          </div>
        }
      >
        <Account />
      </Popup>
      {isLoggedIn ? (
        <Container style={{ marginTop: 2 }}>
          {!dataFetched ? (
            <LinearProgress
              style={{
                marginTop: '100',
              }}
            />
          ) : (
            ''
          )}
          <DataTable
            title='Shareholders'
            columns={columns}
            data={users.data}
            highlightOnHover
            pagination
            paginationServer
            paginationTotalRows={totalRowCount}
            paginationPerPage={countPerPage}
            striped={true}
            hover={true}
            onClickRow={click}
            pagination={dataFetched}
            onChangeRowsPerPage={(perPage) => 4}
            possibleNumberPerPage={[2, 3, 4, 5, 6]}
            paginationComponentOptions={{
              noRowsPerPage: true,
            }}
            onChangePage={(page) => setPage(page - 1)}
          />
        </Container>
      ) : (
        <Navigate to='/rms2/login' />
      )}
    </Page>
  );
};

export default ShareHoldersList;
