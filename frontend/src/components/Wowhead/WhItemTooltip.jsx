import { Link, makeStyles } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import WowIcon from '../icons/WowIcon';

const useStyles = makeStyles({
  legendary: {
    color: '#ff8000',
  },
  epic: {
    color: '#a335ee',
  },
  rare: {
    color: '#0070dd',
  },
  uncommon: {
    color: '#1eff00',
  },
});

const WhItemTooltip = ({
  item, className, icon, iconOnly, showIcon, itemId, itemName,
}) => {
  const classes = useStyles();
  const data = `ilvl=${itemName || item.level.value}&domain=ru${
    item && item.bonusList
      ? (`&bonus=${item.bonusList.join(':')}`)
      : ''}${
    item && item.enchantment
    && item.enchantments.map((i) => i.enchantmentId).filter((i) => i).length > 0
      ? (`&ench=${item.enchantments.map((i) => i.enchantmentId).filter((i) => i).join(':')}`)
      : ''}${
    item && item.sockets && item.sockets.map((i) => i.item).filter((i) => i).length > 0
      ? (`&gems=${item.sockets.map((i) => i.item).filter((i) => i).map((i) => i.id).join(':')}`)
      : ''}`;
  return (
    <Link
      className={`${className} ${classes[item?.quality.type.toLowerCase()] || 'epic'}`}
      href={`https://ru.wowhead.com/item=${item?.item.id || itemId}`}
      data-wowhead={data}
    >
      {showIcon && <WowIcon url={icon} />}
      {!iconOnly && `${item ? `[${item.level.value}]` : ''}${item?.name || itemName}`}
    </Link>
  );
};

WhItemTooltip.propTypes = {
  item: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  icon: PropTypes.string,
  iconOnly: PropTypes.bool,
  showIcon: PropTypes.bool,
  itemId: PropTypes.number,
  itemName: PropTypes.string,
};

WhItemTooltip.defaultProps = {
  item: null,
  className: null,
  icon: null,
  iconOnly: false,
  showIcon: false,
  itemId: null,
  itemName: null,
};

export default WhItemTooltip;
