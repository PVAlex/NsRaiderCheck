import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, makeStyles } from '@material-ui/core';
import { rankConverter } from '@ns/support';
import _ from 'lodash';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import React from 'react';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { useEquippedItemsQuery } from '@ns/apollo';
import GearFilter from '../Filter/GearFilter';
import DiamondIcon from '../icons/DiamondIcon';
import WandIcon from '../icons/WandIcon';
import WhItemTooltip from '../Wowhead/WhItemTooltip';
import Table from './Table';
import { GEAR_TABLE } from './tableName';

const itemColumnWidth = 200;

const useStyles = makeStyles({
  container: {
    height: 'inherit',
  },
  fail: {
    boxShadow: 'inset 0 0 0 2px red',
  },
  wrapper: {
    display: 'flex',
  },
  icons: {
    display: 'flex',
    paddingTop: '3px',
  },
  icon: {
    fontSize: 'inherit',
    color: 'red',
    width: '1em !important',
  },
  link: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    flexGrow: 1,
  },
});

const columns = [
  {
    key: 'name',
    name: 'Имя',
    frozen: true,
    sortable: true,
    width: 150,
  },
  {
    key: 'head',
    name: 'Голова',
    width: itemColumnWidth,
  },
  {
    key: 'neck',
    name: 'Шея',
    width: itemColumnWidth,
  },
  {
    key: 'shoulder',
    name: 'Плечо',
    width: itemColumnWidth,
  },
  {
    key: 'back',
    name: 'Спина',
    width: itemColumnWidth,
  },
  {
    key: 'chest',
    name: 'Нагрудник',
    width: itemColumnWidth,
  },
  {
    key: 'wrist',
    name: 'Запястья',
    width: itemColumnWidth,
  },
  {
    key: 'hands',
    name: 'Кисти рук',
    width: itemColumnWidth,
  },
  {
    key: 'waist',
    name: 'Пояс',
    width: itemColumnWidth,
  },
  {
    key: 'legs',
    name: 'Ноги',
    width: itemColumnWidth,
  },
  {
    key: 'feet',
    name: 'Ступни',
    width: itemColumnWidth,
  },
  {
    key: 'finger_1',
    name: 'Палец',
    width: itemColumnWidth,
  },
  {
    key: 'finger_2',
    name: 'Палец',
    width: itemColumnWidth,
  },
  {
    key: 'trinket_1',
    name: 'Аксессуар',
    width: itemColumnWidth,
  },
  {
    key: 'trinket_2',
    name: 'Аксессуар',
    width: itemColumnWidth,
  },
  {
    key: 'main_hand',
    name: 'Правая рука',
    width: itemColumnWidth,
  },
  {
    key: 'off_hand',
    name: 'Левая рука',
    width: itemColumnWidth,
  },
];

const intSpec = [62, 63, 64, 65, 102, 105, 256, 257, 258, 262, 264, 265, 266, 267, 270];
const strSpec = [66, 70, 71, 72, 73, 104, 250, 251, 252];
const agiSpec = [103, 253, 254, 255, 259, 260, 261, 263, 268, 269, 577, 581];

const intClass = [2, 5, 7, 8, 9, 10, 11];
const strClass = [1, 2, 6];
const agiClass = [3, 4, 7, 10, 11, 12];

const feetEnch = [6211];
const wristEnch = [6220];
const chestEnch = [6213, 6265, 6214, 6217, 6230];
const backEnch = [6208, 6202, 6203, 6204];
const handsEnch = [6210];
const fingerEnch = [6164, 6166, 6168, 6170];
const weaponEnch = [
  6223, 6226, 6227, 6228, 6229,
  6245, 6244, 6242, 6243, 3847, 3368, 6241, 3370, // DK
  6195, 6196, // Scope
];
const gems = [
  173127, 173128, 173129, 173130, // shadowlands
  168636, 168637, 168638, // +7ms bfa
  // Shards of domination
  // Blood
  187057, 187312, 187284, 187293, 187302, // Bek
  187059, 187285, 187294, 187313, 187303, // Jas
  187061, 187286, 187295, 187314, 187304, // Rev
  // Frost
  187063, 187315, 187287, 187296, 187305, // Cor
  187071, 187289, 187298, 187317, 187307, // Tel
  187065, 187288, 187297, 187316, 187306, // Kyr
  // Unholy
  187073, 187318, 187308, 187290, 187299, // Dyz
  187079, 187292, 187301, 187310, 187320, // Zed
  187076, 187291, 187300, 187309, 187319, // Oth
];
// Bad legendary slot
const allArmor = ['HEAD', 'SHOULDER', 'CHEST'];
const cloth = ['WRIST', 'WAIST'];
const leather = ['HAND', 'FEET'];
const mail = ['WAIST', 'FEET'];
const plate = ['WRIST', 'HAND'];

const EquipmentTable = () => {
  const classes = useStyles();

  const testItem = (item, profile) => {
    // [ench, gem, legIlvl, legSlot]
    const fail = [false, false, false, false];
    const { type } = item.inventoryType;
    const { id: itemSubclass } = item.itemSubclass;
    const { type: quality } = item.quality;
    const { value: ilvl } = item.level;
    const cClass = profile.characterClass;
    const {
      specialization: { id: spec },
    } = profile.specialization || { specialization: { id: null } };

    // Enchant
    const ids = item.enchantments ? item.enchantments.map((v) => v.enchantmentId) : null;
    switch (type) {
      case 'FEET':
        if (spec ? agiSpec.includes(spec) : (agiClass.includes(cClass))) {
          fail[0] = ids ? !ids.some((v) => feetEnch.includes(v)) : true;
        }
        break;
      case 'HANDS':
        if (spec ? strSpec.includes(spec) : (strClass.includes(cClass))) {
          fail[0] = ids ? !ids.some((v) => handsEnch.includes(v)) : true;
        }
        break;
      case 'WRIST':
        if (spec ? intSpec.includes(spec) : (intClass.includes(cClass))) {
          fail[0] = ids ? !ids.some((v) => wristEnch.includes(v)) : true;
        }
        break;
      case 'CHEST':
        fail[0] = ids ? !ids.some((v) => chestEnch.includes(v)) : true;
        break;
      case 'BACK':
        fail[0] = ids ? !ids.some((v) => backEnch.includes(v)) : true;
        break;
      case 'FINGER_1':
      case 'FINGER_2':
        fail[0] = ids ? !ids.some((v) => fingerEnch.includes(v)) : true;
        break;
      case 'TWOHWEAPON':
      case 'WEAPON':
      case 'RANGEDRIGHT':
        fail[0] = ids ? !ids.some((v) => weaponEnch.includes(v)) : true;
        break;
      default:
    }

    // Gems
    if (item.sockets && item.sockets.length > 0) {
      item.sockets.forEach((socket) => {
        fail[1] = (socket.item
          ? !gems.includes(socket.item.id)
          : true);
      });
    }

    // Legendary
    if (quality === 'LEGENDARY' && ilvl < 262) fail[2] = true;
    // Wrong slot
    if (quality === 'LEGENDARY'
      && (allArmor.includes(type)
        || (itemSubclass === 1 && cloth.includes(type))
        || (itemSubclass === 2 && leather.includes(type))
        || (itemSubclass === 3 && mail.includes(type))
        || (itemSubclass === 4 && plate.includes(type))
      )) fail[3] = true;

    return fail;
  };

  const createRow = (profile) => {
    let hasFail = false;
    const items = profile.equippedItems.reduce((pItems, item) => {
      const fails = testItem(item, profile);
      const value = (
        <div className={classes.wrapper}>
          <WhItemTooltip item={item} className={classes.link} />
          {
            (fails[0] || fails[1] || fails[2]) && (
              <div className={classes.icons}>
                {fails[0] && <WandIcon className={classes.icon} />}
                {fails[1] && <DiamondIcon className={classes.icon} />}
                {fails[2] && <ArrowDownwardIcon className={classes.icon} />}
                {fails[3] && <FontAwesomeIcon icon={faTimes} className={classes.icon} />}
              </div>
            )
          }
        </div>
      );
      hasFail = hasFail || fails[0] || fails[1] || fails[2];
      return {
        [item.slot.type.toLowerCase()]: {
          value,
          style: (fails[0] || fails[1] || fails[2]) ? classes.fail : null,
        },
        ...pItems,
      };
    }, {});
    return {
      name: profile.name,
      rank: rankConverter(profile.rank),
      rankSort: profile.rank,
      ...items,
      hasFail,
    };
  };

  const sortRows = (sortColumn, sortDirection, rows) => {
    if (sortDirection === 'NONE') return rows;
    let sortedRows = [...rows];
    switch (sortColumn) {
      case 'name':
        sortedRows = _.orderBy(sortedRows, [sortColumn]);
        break;
      default:
    }
    return sortDirection === 'DESC' ? sortedRows.reverse() : sortedRows;
  };

  const filterRows = (filter, rows) => {
    const { hasFail, name, rankSort } = filter;
    return rows
      .filter((row) => !hasFail || row.hasFail)
      .filter((row) => !name || name.filter((n) => row.name.toLowerCase().startsWith(n)).length)
      .filter((row) => rankSort && rankSort.includes(row.rankSort));
  };

  const { loading, profiles } = useEquippedItemsQuery();

  return (
    <Grid className={classes.container} container wrap="nowrap" direction="column">
      <GearFilter />
      <Table
        values={profiles}
        columns={columns}
        rowRenderer={createRow}
        onFilter={filterRows}
        onSort={sortRows}
        tableName={GEAR_TABLE}
        loading={loading}
      />
    </Grid>
  );
};

export { columns };
export default EquipmentTable;
