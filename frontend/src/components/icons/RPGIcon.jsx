import { Icon } from '@material-ui/core';
import React from 'react';
import 'rpg-awesome/css/rpg-awesome.min.css';
import PropTypes from 'prop-types';

const RPGIcon = ({ text, icon, className }) => (
  <Icon className={`ra ${icon} ${className}`}>{text}</Icon>
);

RPGIcon.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string.isRequired,
  className: PropTypes.string,
};

RPGIcon.defaultProps = {
  text: '',
  className: null,
};

export default RPGIcon;
