import { Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { NavBar, ContentRouter } from '@ns/components';
import { useWowhead } from '@ns/support';

const useStyles = makeStyles({
  root: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    overflow: 'hidden',
  },
  tableContainer: {
    height: '100%',
    width: 'inherit',
  },
});

const App = () => {
  const classes = useStyles();
  useWowhead();
  return (
    <Grid container wrap="nowrap" direction="row" className={classes.root}>
      <Grid item>
        <NavBar />
      </Grid>
      <Grid item className={classes.tableContainer}>
        <ContentRouter />
      </Grid>
    </Grid>
  );
};

export default App;
