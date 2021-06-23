import { Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { useProfilesQuery } from '@ns/apollo';
import _ from 'lodash';
import { classConverter, raceConverter } from '@ns/support';
import Filter from '../Filter/Filter';
import Table from './Table';
import { PROFILE_TABLE } from './tableName';

const useStyles = makeStyles({
  container: {
    height: 'inherit',
  },
});

const columns = [
  {
    key: 'name',
    name: 'Имя',
    frozen: true,
    sortable: true,
    resizable: true,
  },
  {
    key: 'race',
    name: 'Раса',
    sortable: true,
    resizable: true,
  },
  {
    key: 'class',
    name: 'Класс',
    sortable: true,
    resizable: true,
  },
  {
    key: 'spec',
    name: 'Специализация',
    sortable: true,
    resizable: true,
  },
  {
    key: 'ilvl',
    name: 'Илвл',
    sortable: true,
    resizable: true,
  },
  {
    key: 'covenant',
    name: 'Ковенант',
    sortable: true,
    resizable: true,
  },
  {
    key: 'soulbind',
    name: 'Медиум',
    sortable: true,
    resizable: true,
  },
];

const createRow = (profile) => {
  const ilvls = profile.equippedItems
    .filter((v) => !(v.inventoryType.type === 'SHIRT'
        || v.inventoryType.type === 'TABARD'
        || v.inventoryType.type === 'BODY'))
    // двуручное считается за 2 одноручные, кроме армсов
    .map((v) => Number(v.level.value)
      * ((v.inventoryType.type === 'TWOHWEAPON'
        && _.filter(profile.equippedItems, (i) => i.inventoryType.type === 'TWOHWEAPON').length !== 2)
      || v.inventoryType.type === 'RANGEDRIGHT' || v.inventoryType.type === 'RANGED' ? 2 : 1));
    // TODO colors ?
  const { specialization: { name: specName } } = profile.specialization || { specialization: { name: '' } };
  const { name: covenantName = '' } = profile.chosenCovenant || {};
  const { soulbinds } = profile;
  const activeSoulbind = soulbinds
    ? (soulbinds.find((v) => v.isActive) || { soulbind: { name: '' } }).soulbind.name
    : '';
  const row = {
    name: profile.name,
    race: raceConverter(profile.race),
    class: classConverter(profile.characterClass),
    spec: specName,
    ilvl: ilvls.length > 0 ? (_.sum(ilvls) / 16).toFixed(2) : '',
    covenant: covenantName,
    soulbind: activeSoulbind,
    rankSort: profile.rank,
  };
  return row;
};

const sortRows = (sortColumn, sortDirection, rows) => {
  if (sortDirection === 'NONE') return rows;
  let sortedRows = [...rows];
  switch (sortColumn) {
    case 'name':
    case 'race':
    case 'class':
    case 'spec':
    case 'covenant':
    case 'soulbind':
      sortedRows = _.orderBy(sortedRows, [(row) => row[sortColumn] || null]);
      break;
    case 'ilvl':
      sortedRows = _.orderBy(sortedRows, [sortColumn], ['desc']);
      break;
    default:
  }
  return sortDirection === 'DESC' ? sortedRows.reverse() : sortedRows;
};

const filterRows = (filter, rows) => {
  const { name, rankSort } = filter;
  return rows
    .filter((row) => !name || name.filter((n) => row.name.toLowerCase().startsWith(n)).length)
    .filter((row) => rankSort && rankSort.includes(row.rankSort));
};

const ProfileTable = () => {
  const classes = useStyles();
  const { profiles, loading } = useProfilesQuery();

  return (
    <Grid className={classes.container} container wrap="nowrap" direction="column">
      <Filter tableName={PROFILE_TABLE} />
      <Table
        columns={columns}
        values={profiles}
        rowRenderer={createRow}
        onFilter={filterRows}
        onSort={sortRows}
        tableName={PROFILE_TABLE}
        loading={loading}
      />
    </Grid>
  );
};

export default ProfileTable;
