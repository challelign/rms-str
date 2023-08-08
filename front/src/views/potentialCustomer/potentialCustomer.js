import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { url } from "../../url";
import district from "./districtList";
const PotentialCustomers = (props) => {
  const [redirect, setRedirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [values, setValues] = useState({
    company_name: "",
    contact_person: "",
    organization_type: "",
    phone: "",
    address: "",
  });

  const saveCustomer = () => {
    if (values.company_name.trim() === "") {
      setErrorMessage("Please provide company name");
    } else if (values.contact_person.trim() === "") {
      setErrorMessage("Please provide Branch");
    } else if (values.phone.trim() === "") {
      setErrorMessage("Please Select District");
    } else {
      axios
        .post(
          url + "/potential_customers",
          {
            company_name: values.company_name,
            contact_person: values.contact_person,
            organization_type: values.organization_type,
            phone: values.phone,
            address: values.address,
          },
          { withCredentials: true }
        )
        .then(
          (data) => {
            window.location.reload(false);

            /* */
          },
          (error) => {
            alert("Connection to the server failed");
          }
        );
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveCustomer(); // Save  when form is submitted
  };
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {}, []);

  return (
    <form
      autoComplete="off"
      noValidate
      // className={clsx(classes.root, className)}
      // {...rest}
      onSubmit={handleSubmit}
    >
      <Card>
        {errorMessage != "" ? (
          <div className="error">
            <Alert severity="warning">{errorMessage}</Alert>
          </div>
        ) : (
          ""
        )}
        <CardHeader title="Potential customer registration" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                name="company_name"
                readOnly={false}
                onChange={handleChange}
                required
                //value={destination_branch}

                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Branch"
                name="contact_person"
                readOnly={false}
                onChange={handleChange}
                required
                aria-label="minimum height"
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Organization Type"
                name="organization_type"
                readOnly={false}
                onChange={handleChange}
                aria-label="minimum height"
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              {/* <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    readOnly={false}
                    onChange={handleChange}                  
                    aria-label="minimum height"
                    variant="outlined"
                  /> */}

              <TextField
                fullWidth
                label="Select District"
                name="phone"
                onChange={handleChange}
                required
                select
                error={
                  values.actions == -1 ? (values.inputError ? true : false) : ""
                }
                SelectProps={{ native: true }}
                // value={values.customerAction}
                variant="outlined"
              >
                {district.map((option, key) => (
                  <option
                    key={option.value}
                    value={option.value}
                    //selected={customer_contact == option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                readOnly={false}
                onChange={handleChange}
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
    </form>
  );
};

export default PotentialCustomers;
