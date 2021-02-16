import { Link } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

// TODO styles
const WhItemTooltip = ({ item, className }) => {
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
    <Link className={className} href={`https://ru.wowhead.com/item=${item.item.id}`} data-wowhead={data}>{`[${item.level.value}]${item.name}`}</Link>
  );
};

WhItemTooltip.propTypes = {
  item: PropTypes.objectOf(PropTypes.any).isRequired,
  className: PropTypes.string,
};

WhItemTooltip.defaultProps = {
  className: null,
};

export default WhItemTooltip;
