import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from '@material-ui/core';
import axios from 'axios';
import { url } from '../../../url';
const customerAction = [
  {
    value: '-1',
  },
  {
    value: '1',
    label: 'do not want to respond',
  },
  {
    value: '2',
    label: 'Contacted',
  },
];
const accountHolder = [
  {
    value: '-1',
  },
  {
    value: '0',
    label: 'Other Transfer type ',
  },
  {
    value: '1',
    label: 'own account',
  },

  {
    value: '2',
    label: 'other  account',
  },
];
const possibleReason = [
  {
    value: '-1',
  },
  {
    value: '1',
    label: 'The company has no account at our bank',
  },
  {
    value: '2',
    label: 'The customer is not interested by our service',
  },
  {
    value: '3',
    label: 'Other bank loan benefits',
  },
  {
    value: '4',
    label: 'Other bank FCY benefits',
  },

  {
    value: '5',
    label: 'Other bank interest rate',
  },
  {
    value: '6',
    label: 'lack of Accessable Branch',
  },
  {
    value: '7',
    label: 'Lack of Digital Banking product',
  },
  {
    value: '8',
    label: 'Other Please state',
  },
];
const banks = [
  {
    value: '-1',
  },
  {
    value: '1',
    label: 'Addis International Bank',
  },
  {
    value: '2',
    label: 'Awash International Bank',
  },
  {
    value: '3',
    label: 'Bank of Abyssinia',
  },
  {
    value: '4',
    label: 'Berhan International Bank',
  },
  {
    value: '5',
    label: 'Bunna International Bank',
  },
  {
    value: '6',
    label: 'Commercial Bank of Ethiopia',
  },
  {
    value: '7',
    label: 'Cooperative Bank of Oromia',
  },
  {
    value: '8',
    label: 'Dashen Bank',
  },
  {
    value: '9',
    label: 'Debub Global Bank',
  },
  {
    value: '10',
    label: 'Enat Bank',
  },
  {
    value: '11',
    label: 'Lion International Bank',
  },
  {
    value: '12',
    label: 'Nib International Bank',
  },
  {
    value: '13',
    label: 'Oromia International Bank',
  },
  {
    value: '14',
    label: 'United Bank',
  },
  {
    value: '15',
    label: 'Wegagen Bank',
  },
  {
    value: '16',
    label: 'Zemen Bank',
  },
  {
    value: '17',
    label: 'Development Bank of Ethiopia',
  },
  {
    value: '18',
    label: 'Abay Bank',
  },

  {
    value: '0',
    label: 'Other Transfer type Please state',
  },
];

const ProfileDetails = (props) => {
  const [data, setData] = useState({});

  const [values, setValues] = useState({
    disabled: true,
    inputError: false,
    beneficiary_name_error: false,
    user_id: 1,
    actions: -1,
    destination_bank: -1,
    customers_reason: -1,
    account_holder: -1,
    destination_branch: '',
    remark: '',
    beneficiary_name: '',
  });
  const action = window.$action;
  const customer_reason = window.$customerReason;
  const destination_bank = window.$destinationBank;
  const destination_branch = window.$destinationBranch;
  const remark = window.$remark;
  const updateID = window.$updateId;
  const account_holder = window.$accountHolder;
  const benef_name = window.$beneficiaryName;

  const closeWindow = () => {
    document.getElementById('one').style.display = 'none';
  };
  const saveReason = () => {
    if (values.actions == -1) {
      setValues({
        ...values,
        inputError: true,
      });
    } else if (
      values.actions == 2 &&
      (values.destination_bank == -1 ||
        values.customers_reason == -1 ||
        values.account_holder == -1)
    ) {
      setValues({
        ...values,
        inputError: true,
      });
    } else if (
      values.account_holder == 2 &&
      values.beneficiary_name.trim() === ''
    ) {
      setValues({
        ...values,
        beneficiary_name_error: true,
      });
    } else {
      axios
        .put(
          url + '/big_withdrow/' + updateID,
          {
            user_id: 1,
            branch_id: 2,
            big_withdrawer_id: updateID,
            action: values.actions,
            destination_bank: values.destination_bank,
            customer_reason: values.customers_reason,
            destination_branch: values.destination_branch,
            beneficiary_name: values.beneficiary_name,
            account_holder: values.account_holder,
            remark: values.remark,
          },
          { withCredentials: true }
        )
        .then(
          (data) => {
            window.location.reload(false);

            /* */
          },
          (error) => {
            alert('Connection to the server failed');
          }
        );
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveReason(); // Save  when form is submitted
  };
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });

    if (event.target.name == 'actions' && event.target.value == 1) {
      setValues({
        ...values,
        disabled: true,
        [event.target.name]: 1,
      });
      console.log(values.disabled);
    } else if (event.target.name == 'actions' && event.target.value == -1) {
      setValues({
        ...values,
        disabled: true,
        [event.target.name]: -1,
      });
      console.log(values.disabled);
    } else if (event.target.name == 'actions' && event.target.value == 2) {
      setValues({
        ...values,
        disabled: false,
        [event.target.name]: 2,
      });
    }
    console.log('actionn' + values.actions);
  };

  useEffect(() => {
    if (action == 2) {
      setValues({
        ...values,
        disabled: false,
        actions: action,
        customers_reason: customer_reason,
        destination_bank: destination_bank,
        destination_branch: destination_branch,
        remark: remark,
        account_holder: account_holder,
        beneficiary_name: benef_name,
      });
    } else if (action == 1 || action == -1) {
      setValues({
        ...values,
        disabled: true,
        actions: action,
        customers_reason: customer_reason,
        destination_bank: destination_bank,
        destination_branch: destination_branch,
        remark: remark,
        account_holder: account_holder,
        beneficiary_name: benef_name,
      });
    }
  }, []);

  return (
    <form
      autoComplete='off'
      noValidate
      // className={clsx(classes.root, className)}
      // {...rest}
      onSubmit={handleSubmit}
    >
      {updateID != 0 ? (
        <Card>
          <Button
            color='primary'
            style={{ marginLeft: 'auto', float: 'right' }}
            onClick={closeWindow}
          >
            Close Window
          </Button>
          <CardHeader
            subheader="What was customer's response ? and the issue occured for making big withdrowal?"
            title='Customers Response'
          />
          <Divider />

          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label='Action'
                  name='actions'
                  onChange={handleChange}
                  required
                  select
                  error={
                    values.actions == -1
                      ? values.inputError
                        ? true
                        : false
                      : ''
                  }
                  SelectProps={{ native: true }}
                  value={values.customerAction}
                  variant='outlined'
                >
                  {customerAction.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      selected={action == option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label='Account transfer type'
                  name='account_holder'
                  onChange={handleChange}
                  disabled={values.disabled}
                  error={
                    values.account_holder == -1
                      ? values.inputError
                        ? true
                        : false
                      : ''
                  }
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.account_holder}
                  variant='outlined'
                >
                  {accountHolder.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      selected={account_holder == option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label='Destinatination Bank'
                  name='destination_bank'
                  onChange={handleChange}
                  required
                  disabled={values.disabled}
                  select
                  error={
                    values.destination_bank == -1
                      ? values.inputError
                        ? true
                        : false
                      : ''
                  }
                  SelectProps={{ native: true }}
                  value={values.possibleReason}
                  variant='outlined'
                >
                  {banks.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      selected={destination_bank == option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label='Destination Branch'
                  name='destination_branch'
                  disabled={values.disabled}
                  readOnly={false}
                  value={values.destination_branch}
                  onChange={handleChange}
                  required
                  //value={destination_branch}

                  variant='outlined'
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label='Beneficiary Name'
                  name='beneficiary_name'
                  disabled={values.disabled}
                  readOnly={false}
                  value={values.beneficiary_name}
                  error={values.beneficiary_name_error ? true : false}
                  onChange={handleChange}
                  required
                  //value={destination_branch}

                  variant='outlined'
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label='Customer reason'
                  name='customers_reason'
                  onChange={handleChange}
                  disabled={values.disabled}
                  required
                  select
                  error={
                    values.customers_reason == -1
                      ? values.inputError
                        ? true
                        : false
                      : ''
                  }
                  SelectProps={{ native: true }}
                  value={values.banks}
                  variant='outlined'
                >
                  {possibleReason.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      selected={customer_reason == option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label='Future Promise on Plan'
                  name='remark'
                  readOnly={false}
                  disabled={values.disabled}
                  onChange={handleChange}
                  value={values.remark}
                  required
                  multiline
                  rows={3}
                  aria-label='minimum height'
                  variant='outlined'
                />
              </Grid>
              <Grid item md={6} xs={12}></Grid>
            </Grid>
          </CardContent>
          <Divider />
          <Box display='flex' justifyContent='flex-end' p={2}>
            <Button
              to='/app/account'
              color='primary'
              variant='contained'
              type='submit'
            >
              Save details
            </Button>
          </Box>
        </Card>
      ) : (
        ''
      )}
    </form>
  );
};

export default ProfileDetails;
