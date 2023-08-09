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
  makeStyles
} from '@material-ui/core';
import axios from 'axios';
import {url} from '../../../url';

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
const customersFullPotential = [
  {
    value: '-1'
  },
  {
    value: '0',
    label: 'unknown'
  },{
    value: '1',
    label: 'Yes'
  },

  {
    value: '2',
    label: 'No'
  },
  
  {
    value: '3',
    label: 'Other reason'
  }
  
];


const ProfileDetails= props => {
  const [data, setData] = useState({});
  
  const [values, setValues] = useState({
    disabled: true,
    user_id: 1,
    inputError: false,
    actions: -1,
    customers_full_potential_attended: -1,
    customers: '',
    supplier: '',
    comment: ''

  });
  const action =  window.$depositor_action;
  const supplier =  window.$depositor_supplier;
  const customers =  window.$depositor_customers;
  const comment = window.$depositor_comment;
  const updateID = window.$depositor_updateId;
  const customers_potential_attended = window.$customers_full_potential;

  const saveReason = () => {

    if (values.actions == -1) {
      setValues({
        ...values,
        inputError: true
      });
    } else if (values.actions == 2 && values.customers_full_potential_attended == -1) {
      setValues({
        ...values,
        inputError: true
      });
    }
    else{


      axios.put(url+'/top_depositor/' + updateID,  {
        user_id: 1,
          action: values.actions,
          supplier: values.supplier,
          customers: values.customers,
          comment: values.comment,
          customers_full_potential_attended: values.customers_full_potential_attended,
      },{withCredentials: true})
    .then(data => {
     
      window.location.reload(false);
  
      /* */
    }, (error) => {
      alert('Connection to the server failed');
    });
    }
  

 
  };
  const closeWindow =()=>{
    document.getElementById("three").style.display = "none";   
  }
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
    }else if (event.target.name == 'actions' && event.target.value == -1) {
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
        supplier: supplier,
        customers: customers,
        comment: comment,
        customers_full_potential_attended: customers_potential_attended,
      });
    } else if (action == 1) {
      setValues({
        ...values,
        disabled: true,
        actions: action,
        supplier: supplier,
        customers: customers,
        comment: comment,
        customers_full_potential_attended: customers_potential_attended,
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
          <Button  color="primary" style={{ marginLeft: 'auto', float: 'right' }} onClick={closeWindow}>
              Close Window
            </Button>
          <CardHeader
            subheader="Top Deposiors status, depositors info is nedded so that we can provide better service !"
            title="Customers response"
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
                  label="Customers full potential obtained"
                  name="customers_full_potential_attended"
                  onChange={handleChange}
                  required
                  error={values.customers_full_potential_attended == -1 ?  values.inputError ?   true : false :''}
                  disabled={values.disabled}
                  select
                  SelectProps={{ native: true }}
                  value={values.customers_full_potential_attended}
                  variant="outlined"
                >
                  {customersFullPotential.map(option => (
                    <option
                      key={option.value}
                      value={option.value}
                      selected={customers_potential_attended == option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
         
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Supplier of the Customer"
                  name="supplier"
                  disabled={values.disabled}
                  readOnly={false}
                  value={values.supplier}
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
                  label="List of his/hers/its Customers"
                  name="customers"
                  readOnly={false}
                  disabled={values.disabled}
                  onChange={handleChange}
                  value={values.customers}
                  required
                  multiline
                  rows={3}
                  aria-label="minimum height"
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Comment"
                  name="comment"
                  readOnly={false}
                  disabled={values.disabled}
                  onChange={handleChange}
                  value={values.comment}
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
