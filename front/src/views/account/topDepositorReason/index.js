import React from 'react';
import { Container, Grid, makeStyles, Button } from '@material-ui/core';

// import Page from 'src/components/Page';
import Page from '../../../components/Page';

import Profile from './Profile';
import ProfileDetails from './ProfileDetails';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const TopDepositor = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title='Deposit Status'>
      <Container maxWidth='lg' style={{ marginTop: -20 }} id='three'>
        <Grid container spacing={3}>
          <Grid item lg={4} md={6} xs={12}>
            <Profile />
          </Grid>
          <Grid item lg={8} md={6} xs={12}>
            <ProfileDetails />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default TopDepositor;
