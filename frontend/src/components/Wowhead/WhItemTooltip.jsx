import { Link } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import WowIcon from '../icons/WowIcon';

// TODO styles
const WhItemTooltip = ({
  item, className, icon, iconOnly, showIcon,
}) => {
  const data = `item=${item.item.id}&ilvl=${item.level.value}&domain=ru${
    item.bonusList
      ? (`&bonus=${item.bonusList.join(':')}`)
      : ''}${
    item.enchantments && item.enchantments.map((i) => i.enchantmentId).filter((i) => i).length > 0
      ? (`&ench=${item.enchantments.map((i) => i.enchantmentId).filter((i) => i).join(':')}`)
      : ''}${
    item.sockets && item.sockets.map((i) => i.item).filter((i) => i).length > 0
      ? (`&gems=${item.sockets.map((i) => i.item).filter((i) => i).map((i) => i.id).join(':')}`)
      : ''}`;
  return (
    <Link className={className} href={`https://ru.wowhead.com/item=${item.item.id}`} data-wowhead={data}>
      {showIcon && <WowIcon name={item.name} url={icon} />}
      {!iconOnly && `[${item.level.value}]${item.name}`}
    </Link>
  );
};

WhItemTooltip.propTypes = {
  item: PropTypes.objectOf(PropTypes.any).isRequired,
  className: PropTypes.string,
  icon: PropTypes.string,
  iconOnly: PropTypes.bool,
  showIcon: PropTypes.bool,
};

WhItemTooltip.defaultProps = {
  className: null,
  icon: null,
  iconOnly: false,
  showIcon: false,
};

export default WhItemTooltip;
