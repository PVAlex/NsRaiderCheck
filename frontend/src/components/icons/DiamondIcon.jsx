import PropTypes from 'prop-types';
import React from 'react';
import RPGIcon from './RPGIcon';

const DiamondIcon = ({ text, className }) => (
  <RPGIcon text={text} icon="ra-diamond" className={className} />
);

DiamondIcon.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
};

DiamondIcon.defaultProps = {
  text: '',
  className: null,
};

export default DiamondIcon;
