import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@material-ui/core';
import axios from 'axios';

import { url } from '../../../url';
const customerAction = [
  {
    value: '-1'
  },
  {
    value: '1',
    label: 'do not want to respond'
  },

  {
    value: '2',
    label: 'Contacted'
  }
];
const possibleReason = [
  {
    value: '-1'
  },
  {
    value: '1',
    label: 'No account at Abay Bank'
  },
  {
    value: '2',
    label: 'Has account with active transaction at Abay Bank'
  },
  {
    value: '3',
    label: 'Has Account with Dormant transaction at Abay Bank'
  },
  {
    value: '4',
    label: 'Has account with significant deposit at Abay Bank'
  },
  ,
  {
    value: '5',
    label: 'Other Please state'
  }
];

const ProfileDetails = props => {
  const [data, setData] = useState({});

  const [values, setValues] = useState({
    disabled: true,
    user_id: 1,
    actions: -1,
    reason: -1,
    remark: '',
    inputError: false,
    efforts: ''
  });

  const action = window.$shareholder_action;
  const reason = window.$shareholder_reason;
  const efforts = window.$shareholder_efforts;
  const remark = window.$shareholder_remark;
  const updateID = window.$shareholder_updateId;
  const closeWindow = () => {
    document.getElementById('two').style.display = 'none';
  };

  const saveReason = () => {
    if (values.actions == -1) {
      setValues({
        ...values,
        inputError: true
      });
    } else if (values.actions == 2 && values.reason == -1) {
      setValues({
        ...values,
        inputError: true
      });
    } else {
      axios
        .put(
          url + '/shareholder/' + updateID,
          {
            user_id: 1,
            action: values.actions,
            reason: values.reason,
            remark: values.remark,
            efforts: values.efforts
          },
          { withCredentials: true }
        )
        .then(
          data => {
            window.location.reload(false);

            /* */
          },
          error => {
            alert('Connection to the server failed');
          }
        );
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    saveReason(); // Save  when form is submitted
  };
  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });

    if (event.target.name == 'actions' && event.target.value == 1) {
      setValues({
        ...values,
        disabled: true,
        [event.target.name]: 1
      });
      console.log(values.disabled);
    } else if (event.target.name == 'actions' && event.target.value == -1) {
      setValues({
        ...values,
        disabled: true,
        [event.target.name]: -1
      });
      console.log(values.disabled);
    } else if (event.target.name == 'actions' && event.target.value == 2) {
      setValues({
        ...values,
        disabled: false,
        [event.target.name]: 2
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
        reason: reason,
        remark: remark,
        efforts: efforts
      });
    } else if (action == 1) {
      setValues({
        ...values,
        disabled: true,
        actions: action,
        reason: reason,
        remark: remark,
        efforts: efforts
      });
    }
  }, []);

  return (
    <form
      autoComplete="off"
      noValidate
      // className={clsx(classes.root, className)}
      // {...rest}
      onSubmit={handleSubmit}
    >
      {updateID != 0 ? (
        <Card>
          <Button
            color="primary"
            style={{ marginLeft: 'auto', float: 'right' }}
            onClick={closeWindow}
          >
            Close Window
          </Button>
          <CardHeader
            subheader="Shareholder reason ? why is this shareholder idel ?"
            title="Customers Response"
          />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Action"
                  name="actions"
                  onChange={handleChange}
                  required
                  select
                  error={values.actions == -1 ?  values.inputError ?   true : false :''}
                  SelectProps={{ native: true }}
                  value={values.customerAction}
                  variant="outlined"
                >
                  {customerAction.map(option => (
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
                  label="status"
                  name="reason"
                  onChange={handleChange}
                  disabled={values.disabled}
                  required
                  select
                  error={values.reason == -1 ?  values.inputError ?   true : false :''}
                  SelectProps={{ native: true }}
                  value={values.possibleReason}
                  variant="outlined"
                >
                  {possibleReason.map(option => (
                    <option
                      key={option.value}
                      value={option.value}
                      selected={reason == option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="efforts"
                  name="efforts"
                  disabled={values.disabled}
                  readOnly={false}
                  value={values.efforts}
                  multiline
                  rows={3}
                  onChange={handleChange}
                  required
                  //value={destination_branch}

                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Future Promise on Plan"
                  name="remark"
                  readOnly={false}
                  disabled={values.disabled}
                  onChange={handleChange}
                  value={values.remark}
                  required
                  multiline
                  rows={3}
                  aria-label="minimum height"
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}></Grid>
            </Grid>
          </CardContent>
          <Divider />
          <Box display="flex" justifyContent="flex-end" p={2}>
            <Button color="primary" variant="contained" type="submit">
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
