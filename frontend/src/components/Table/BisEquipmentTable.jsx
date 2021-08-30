import { Grid, makeStyles } from '@material-ui/core';
import {
  useBisItemsQuery,
  useBisProfilesQuery,
  useSetBisItemMutation,
} from '@ns/apollo/apolloHooks';
import { rankConverter } from '@ns/support/converters';
import _ from 'lodash';
import React, { useMemo } from 'react';
import Filter from '../Filter/Filter';
import Table from './Table';
import { BIS_EQUIPMENT_TABLE } from './tableName';
import DropDownEditor from './cell/DropDownEditor';

const useStyles = makeStyles({
  container: {
    height: 'inherit',
  },

  redBox: {
    boxShadow: 'inset 0 0 0 4px #ff7600',
  },
  yellowBox: {
    boxShadow: 'inset 0 0 0 4px #ffe000',
  },
  greenBox: {
    boxShadow: 'inset 0 0 0 4px #52c552',
  },
});

const itemColumnWidth = 200;

const BisEquipmentTable = () => {
  const classes = useStyles();
  const { loading: profilesLoading, profiles, refetch } = useBisProfilesQuery();
  const { loading: itemsLoading, items } = useBisItemsQuery();
  const { save: setBisItem } = useSetBisItemMutation(() => refetch());

  const sortedBisItems = useMemo(() => items.reduce((p, v) => {
    const itemClass = v.item.itemClass.id;
    const itemName = v.item.name;
    const itemId = v.id;
    // const itemSubclass = v.item.itemSubclass.id;
    const inventoryType = v.item.inventoryType.type.toLowerCase();
    if (itemClass === 4) {
      return {
        ...p,
        [inventoryType]: [...(p[inventoryType] || []), { text: itemName, value: itemId }],
      };
    }
    if (itemClass === 2) {
      return {
        ...p,
        main_hand: [...(p.main_hand || []), { text: itemName, value: itemId }],
      };
    }
    return { ...p };
  }, {}), [itemsLoading]);

  const getItems = (key) => {
    let i;
    switch (key) {
      case 'chest':
        i = [
          ...sortedBisItems.chest,
          ...sortedBisItems.robe,
        ];
        break;
      case 'finger_1':
      case 'finger_2':
        i = sortedBisItems.finger;
        break;
      case 'trinket_1':
      case 'trinket_2':
        i = sortedBisItems.trinket;
        break;
      case 'off_hand':
        i = [
          ...sortedBisItems.main_hand || [],
          ...sortedBisItems.shield || [],
          ...sortedBisItems.off_hand || [],
        ];
        break;
      default:
        i = sortedBisItems[key];
        break;
    }
    return i || [];
  };
  const dropDownEditor = (p) => {
    const name = p.row.name.props.value;
    const slot = p.column.key;
    return (
      <DropDownEditor
        onChange={(event) => (
          setBisItem(name, slot, event.target.value !== 0 ? event.target.value : null)
        )}
        items={getItems(p.column.key)}
        selected={p.row[p.column.key]?.props.value || ''}
      />
    );
  };

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
      editor: dropDownEditor,
      editorOptions: {
        editOnClick: true,
      },
    },
    {
      key: 'neck',
      name: 'Шея',
      width: itemColumnWidth,
      editor: dropDownEditor,
      editorOptions: {
        editOnClick: true,
      },
    },
    {
      key: 'shoulder',
      name: 'Плечо',
      width: itemColumnWidth,
      editor: dropDownEditor,
      editorOptions: {
        editOnClick: true,
      },
    },
    {
      key: 'cloak',
      name: 'Спина',
      width: itemColumnWidth,
      editor: dropDownEditor,
      editorOptions: {
        editOnClick: true,
      },
    },
    {
      key: 'chest',
      name: 'Нагрудник',
      width: itemColumnWidth,
      editor: dropDownEditor,
      editorOptions: {
        editOnClick: true,
      },
    },
    {
      key: 'wrist',
      name: 'Запястья',
      width: itemColumnWidth,
      editor: dropDownEditor,
      editorOptions: {
        editOnClick: true,
      },
    },
    {
      key: 'hand',
      name: 'Кисти рук',
      width: itemColumnWidth,
      editor: dropDownEditor,
      editorOptions: {
        editOnClick: true,
      },
    },
    {
      key: 'waist',
      name: 'Пояс',
      width: itemColumnWidth,
      editor: dropDownEditor,
      editorOptions: {
        editOnClick: true,
      },
    },
    {
      key: 'legs',
      name: 'Ноги',
      width: itemColumnWidth,
      editor: dropDownEditor,
      editorOptions: {
        editOnClick: true,
      },
    },
    {
      key: 'feet',
      name: 'Ступни',
      width: itemColumnWidth,
      editor: dropDownEditor,
      editorOptions: {
        editOnClick: true,
      },
    },
    {
      key: 'finger_1',
      name: 'Палец',
      width: itemColumnWidth,
      editor: dropDownEditor,
      editorOptions: {
        editOnClick: true,
      },
    },
    {
      key: 'finger_2',
      name: 'Палец',
      width: itemColumnWidth,
      editor: dropDownEditor,
      editorOptions: {
        editOnClick: true,
      },
    },
    {
      key: 'trinket_1',
      name: 'Аксессуар',
      width: itemColumnWidth,
      editor: dropDownEditor,
      editorOptions: {
        editOnClick: true,
      },
    },
    {
      key: 'trinket_2',
      name: 'Аксессуар',
      width: itemColumnWidth,
      editor: dropDownEditor,
      editorOptions: {
        editOnClick: true,
      },
    },
    {
      key: 'main_hand',
      name: 'Правая рука',
      width: itemColumnWidth,
      editor: dropDownEditor,
      editorOptions: {
        editOnClick: true,
      },
    },
    {
      key: 'off_hand',
      name: 'Левая рука',
      width: itemColumnWidth,
      editor: dropDownEditor,
      editorOptions: {
        editOnClick: true,
      },
    },
  ];

  const createRow = (profile) => {
    const row = profile.items.reduce((p, v) => {
      let style;
      if (v.ilvl >= 252 && (v.analog || v.itemId === v.currentItemId)) {
        style = classes.greenBox;
      } else if (v.ilvl >= 239 && (v.analog || v.itemId === v.currentItemId)) {
        style = classes.yellowBox;
      } else {
        style = classes.redBox;
      }
      return { ...p, [v.itemSlot]: { value: v.itemName, style } };
    }, {});
    return {
      name: profile.name,
      rank: rankConverter(profile.rank),
      rankSort: profile.rank,
      ...row,
    };
  };
  const filterRows = (filter, rows) => {
    const { name, rankSort } = filter;
    return rows
      .filter((row) => !name || name.filter((n) => row.name.toLowerCase().startsWith(n)).length)
      .filter((row) => rankSort && rankSort.includes(row.rankSort));
  };
  const sortRows = (sortColumn, sortDirection, rows) => {
    if (sortDirection === 'NONE') return rows;
    let sortedRows = [...rows];
    switch (sortColumn) {
      case 'name':
        sortedRows = _.orderBy(sortedRows, [sortColumn]);
        break;
      case 'rank':
        sortedRows = _.orderBy(sortedRows, [`${sortColumn}Sort`]);
        break;
      default:
    }
    return sortDirection === 'DESC' ? sortedRows.reverse() : sortedRows;
  };

  return (
    <Grid className={classes.container} container wrap="nowrap" direction="column">
      <Filter tableName={BIS_EQUIPMENT_TABLE} />
      <Table
        values={profiles}
        rowRenderer={createRow}
        onFilter={filterRows}
        onSort={sortRows}
        tableName={BIS_EQUIPMENT_TABLE}
        columns={columns}
        loading={profilesLoading}
      />
    </Grid>
  );
};

export default BisEquipmentTable;
