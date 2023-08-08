import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  makeStyles
} from '@material-ui/core';



const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100
  }
}));

const Profile = ({ className, ...rest }) => {
  const classes = useStyles();
  const customer_name = window.$customer_name;
  const phone =  window.$customer_contact_address;
  return (
    <Card  style={ {  marginLeft: 45, width: 330 }}
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent   style={{
          alignItems: 'center',
          textAlignVertical: 'center',
          textAlign: 'center'
        }} >
        <Box 
          alignItems="center"
          display="flex"
          flexDirection="column"
          // paddingLeft="10"
        >
          <Avatar
            
            
          />
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h5"
            text-align="center"
          >
           
            {customer_name}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            {`${phone} ${""}`}
          </Typography>
          <Typography
            className={classes.dateText}
            color="textSecondary"
            variant="body1"
          >
            {}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
     
    </Card>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
