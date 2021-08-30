import { Link } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import WowIcon from '../icons/WowIcon';

const WhSpellTooltip = ({
  spellId, name, className, icon, iconOnly, showIcon,
}) => (
  <Link
    className={className}
    href={spellId ? `https://ru.wowhead.com/spell=${spellId}` : null}
    data-wowhead={spellId ? `spell=${spellId}` : null}
  >
    {showIcon && <WowIcon url={icon} />}
    {!iconOnly && name}
  </Link>
);

WhSpellTooltip.propTypes = {
  spellId: PropTypes.number,
  name: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.string,
  iconOnly: PropTypes.bool,
  showIcon: PropTypes.bool,
};

WhSpellTooltip.defaultProps = {
  spellId: null,
  name: null,
  className: null,
  icon: null,
  iconOnly: false,
  showIcon: false,
};

export default WhSpellTooltip;
