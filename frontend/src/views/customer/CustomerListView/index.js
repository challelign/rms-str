import React, { useState, useEffect, useRef } from 'react';
import { Container, Button, makeStyles } from '@material-ui/core';
import DataTable from 'react-data-table-component';
// import Page from 'src/components/Page';
import Page from '../../../components/Page';

import axios from 'axios';
import Account from '../../account/BigwithdrawReason';
import Popup from 'reactjs-popup';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { Navigate } from 'react-router-dom';
import { url } from '../../../url';
import LinearProgress from '@material-ui/core/LinearProgress';

//global variables
window.$updateId = 0;
window.$name = '';
window.$address = '';
window.$phone = '';
window.$action = 0;
window.$customerReason = 0;
window.$destinationBank = 0;
window.$destinationBranch = '';
window.$accountHolder = 0;
window.$remark = 0;
window.$beneficiaryName = '';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const CustomerListView = ({ values }) => {
  const [value, setValue] = React.useState('');
  const myRefname = useRef(null);
  const columns = [
    {
      name: 'Transaction Id',
      selector: 'transaction_id',
    },
    {
      name: 'Transaction Amount',
      selector: 'amount',
    },

    {
      name: 'Account Number',
      selector: 'account_number',
    },
    {
      name: 'Transaction Date',
      selector: 'transaction_date',
    },

    {
      name: 'Status on reason update',

      cell: (row) =>
        row.status_response === 1 ? (
          <CheckIcon style={{ fill: 'green' }} />
        ) : row.status_response === 0 ? (
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
                row.customer_name,
                row.customer_address,
                row.customer_phone,
                row.action,
                row.customer_reason,
                row.destination_bank,
                row.destination_branch,
                row.remark,
                row.account_holder,
                row.beneficiary_name
              )
            }
          >
            Reason
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
  const countPerPage = 6;
  const [dataFetched, setDataFetched] = useState(false);
  const handleChange = (state) => {
    // You can use setState or dispatch with something like Redux so we can use the retrieved data
    console.log('Selected Rows: ', state.selectedRows);
  };

  function handleChanges(newValue) {
    setValue(newValue);
  }
  const click = (
    id,
    customer_name,
    customer_address,
    customer_phone,
    action,
    customer_reason,
    destination_bank,
    destination_branch,
    remark,
    account_holder,
    benef_name
  ) => {
    myRefname.current.click();
    window.$updateId = id;
    window.$name = customer_name;
    window.$address = customer_address;
    window.$phone = customer_phone;
    window.$action = action;
    window.$customerReason = customer_reason;
    window.$destinationBank = destination_bank;
    window.$destinationBranch = destination_branch;
    window.$remark = remark;
    window.$accountHolder = account_holder;
    window.$beneficiaryName = benef_name;
  };
  const getUserList = () => {
    setDataFetched(false);
    console.log(page);
    console.log(countPerPage);
    axios

      .get(`${url}/big_withdrow/all/${page}/${countPerPage}`, {
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
      title='Big Withdrowal'
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
            title='Big Withdrowal of the previous day'
            columns={columns}
            data={users.data}
            highlightOnHover
            pagination
            paginationServer
            paginationTotalRows={totalRowCount}
            paginationPerPage={countPerPage}
            striped={true}
            hover={true}
            pagination={dataFetched}
            onClickRow={click}
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

export default CustomerListView;
