import { makeStyles } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: 'inherit',
  },
  progress: {
    width: '100%',
    border: '1px solid rgba(0, 0, 0, 0.12)',
    height: '26px',
    overflow: 'hidden',
    position: 'relative',
    borderRadius: '2px',
  },
  progressText: {
    width: '100%',
    display: 'flex',
    position: 'absolute',
    lineHeight: '24px',
    justifyContent: 'center',
  },
  text: {
    paddingLeft: '5px',
    width: '300px',
  },
  low: {
    height: '100%',
    backgroundColor: '#f44336',
  },
  medium: {
    height: '100%',
    backgroundColor: '#efbb5aa3',
  },
  high: {
    height: '100%',
    backgroundColor: '#088208a3',
  },
});

const ProgressCell = ({ max, current, text }) => {
  const classes = useStyles();
  const barWidth = max !== 0 ? (100 / max) * current : 100;
  let barClass;
  if (barWidth < 33) {
    barClass = 'low';
  } else if (barWidth < 66) {
    barClass = 'medium';
  } else {
    barClass = 'high';
  }
  return (
    <div className={classes.root}>
      <div className={classes.progress}>
        {max !== 0 && <div className={classes.progressText}>{`${current}/${max}`}</div>}
        <div className={classes[barClass]} style={{ maxWidth: `${barWidth}%` }} />
      </div>
      {text && <div className={classes.text}>{text}</div>}
    </div>
  );
};

ProgressCell.propTypes = {
  max: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  text: PropTypes.string,
};

ProgressCell.defaultProps = {
  text: null,
};

export default ProgressCell;
