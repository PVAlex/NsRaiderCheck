import { makeStyles } from '@material-ui/styles';
import React from 'react';
import PropTypes from 'prop-types';
import defaultIcon from '../../icons/inv_misc_questionmark.jpg';

const WowIcon = ({ url }) => {
  const classes = makeStyles({
    wowIcon: {
      border: '2px solid purple',
      'border-radius': '5px',
      display: 'grid',
      overflow: 'hidden',
      height: '26px',
      width: '26px',
      backgroundImage: `url(${url || defaultIcon})`,
      backgroundSize: 'contain',
    },
  })();
  return <div className={classes.wowIcon} />;
};

WowIcon.propTypes = {
  url: PropTypes.string,
};

WowIcon.defaultProps = {
  url: defaultIcon,
};

export default WowIcon;
