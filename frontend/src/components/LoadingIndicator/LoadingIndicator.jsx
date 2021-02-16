import { CircularProgress, Grid, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
  root: {
    height: '100%',
  },
});

/**
 * Индикатор загрузки.
 */
function LoadingIndicator() {
  const classes = useStyles();
  return (
    <Grid justify="center" alignContent="center" container className={classes.root}>
      <CircularProgress />
    </Grid>
  );
}

export default LoadingIndicator;
