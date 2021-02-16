import { Link } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

const WhSpellTooltip = ({ spellId, name, className }) => (
  <Link className={className} href={`https://ru.wowhead.com/spell=${spellId}`} data-wowhead={`spell=${spellId}`}>{name}</Link>
);

WhSpellTooltip.propTypes = {
  spellId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};

WhSpellTooltip.defaultProps = {
  className: null,
};

export default WhSpellTooltip;
