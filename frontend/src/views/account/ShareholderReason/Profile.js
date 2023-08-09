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
  const name = window.$shareholder_name;
  const adress = window.$shareholder_address;
  const phone = window.$shareholder_phone;
  const classes = useStyles();
  const updateID = window.$shareholder_updateId;

  return (
    <Card
    style={{ marginLeft: 90, width: 291 }}
    className={clsx(classes.root, className)}
    {...rest}
    >
      <CardContent
        style={{
          alignItems: 'center',
          textAlignVertical: 'center',
          textAlign: 'center'
        }}
      >
        {updateID != 0 ? (
          <Box alignItems="center" display="flex" flexDirection="column">
            <Avatar  />
            <Typography color="textPrimary" gutterBottom variant="h3">
              {name}
            </Typography>
            <Typography color="textSecondary" variant="body1">
              {adress}
            </Typography>
            <Typography color="textSecondary" variant="body1">
              {phone}
            </Typography>
          </Box>
        ) : (
          ''
        )}
      </CardContent>
      <Divider />
    </Card>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
