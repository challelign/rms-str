import React, { useState, useEffect } from 'react';
import { url } from '../../../../url';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles
} from '@material-ui/core';

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
    value: '0',
    label: 'unknown'
  },
  {
    value: '1',
    label: 'Disactisfaction on the bank service'
  },
  {
    value: '2',
    label: 'Other bank loan benefits'
  },
  {
    value: '3',
    label: 'Other bank FCY benefits'
  },

  {
    value: '4',
    label: 'Other bank interest rate'
  },
  {
    value: '5',
    label: 'lack of accessability (Branch Network)'
  },
  {
    value: '6',
    label: 'Other, Please state '
  }
];

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ props, className, ...rest }) => {
  const updateID = window.$updateId;
  const customer_contact = window.$dormant_customer_action;
  const reason = window.$dormant_reason;
  const remark = window.$dormant_remark;
  const o_reason = window.$other_reason;

  const [values, setValues] = useState({
    disabled: true,
    inputError: false,
    actions: -1,
    reason: -1,
    remark: '',
    other_reason: ''
  });
  const saveReason = () => {
    if (values.actions == -1) {
      setValues({
        ...values,
        inputError: true
      });
    } else if (
      values.actions == 2 &&
      values.reason == -1
    ) {
      setValues({
        ...values,
        inputError: true
      });
    } else {
      axios
        .put(
          url + '/dormants/' + updateID,
          {
            dormant_account_id: updateID,
            user_id: 1,
            action: values.actions,
            reasons: values.reason,
            remark: values.remark,
            other_reason: values.other_reason
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
    saveReason();
  };
  const closeWindow = () => {
    document.getElementById('four').style.display = 'none';
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
    } else if (event.target.name == 'actions' && event.target.value == 2) {
      setValues({
        ...values,
        disabled: false,
        [event.target.name]: 2
      });
    }
  };
  useEffect(() => {
    if (customer_contact == 2) {
      setValues({
        ...values,
        disabled: false,
        actions: customer_contact,
        reason: reason,
        remark: remark,
        other_reason: o_reason
      });
    } else if (customer_contact == 1) {
      setValues({
        ...values,
        disabled: true,
        actions: customer_contact,
        reason: reason,
        remark: remark,
        other_reason: o_reason
      });
    }
  }, []);
  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
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
            subheader="What was customer's response ? and the issue occured for making big withdrowal?"
            title="Customers Response"
          />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Is Contacted?"
                  name="actions"
                  onChange={handleChange}
                  required
                  select
                  error={values.actions == -1 ?  values.inputError ?   true : false :''}
                  SelectProps={{ native: true }}
                  // value={values.customerAction}
                  variant="outlined"
                >
                  {customerAction.map(option => (
                    <option
                      key={option.value}
                      value={option.value}
                      selected={customer_contact == option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Reason for Dormancy"
                  name="reason"
                  onChange={handleChange}
                  required
                  disabled={values.disabled}
                  select
                  SelectProps={{ native: true }}
                  error={values.reason == -1 ?  values.inputError ?   true : false :''}
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
                  label="Remark or other reason"
                  name="other_reason"
                  onChange={handleChange}
                  multiline
                  rows={3}
                  aria-label="minimum height"
                  disabled={values.disabled}
                  value={values.other_reason}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Future Promise on Plan"
                  name="remark"
                  onChange={handleChange}
                  required
                  multiline
                  rows={3}
                  aria-label="minimum height"
                  disabled={values.disabled}
                  value={values.remark}
                  variant="outlined"
                />
              </Grid>

              <Grid item md={6} xs={12}></Grid>
            </Grid>
          </CardContent>
          <Divider />
          <Box display="flex" justifyContent="flex-end" p={2}>
            <Button
              to="/app/account"
              color="primary"
              variant="contained"
              type="submit"
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

ProfileDetails.propTypes = {
  // className: PropTypes.string
};

export default ProfileDetails;
