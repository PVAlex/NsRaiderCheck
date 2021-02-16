import PropTypes from 'prop-types';
import React from 'react';
import RPGIcon from './RPGIcon';

const WandIcon = ({ text, className }) => (
  <RPGIcon text={text} icon="ra-crystal-wand" className={className} />
);

WandIcon.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
};

WandIcon.defaultProps = {
  text: '',
  className: null,
};

export default WandIcon;
