import React, { useCallback, useMemo, useState } from 'react';
import { useProfilesQuery } from '@ns/apollo';
import _ from 'lodash';
import { classConverter, raceConverter, rankConverter } from '@ns/support';
import Table from './Table';

const columns = [
  {
    key: 'name',
    name: 'Имя',
    frozen: true,
  },
  {
    key: 'rank',
    name: 'Ранг',
  },
  {
    key: 'race',
    name: 'Раса',
  },
  {
    key: 'class',
    name: 'Класс',
  },
  {
    key: 'spec',
    name: 'Специализация',
  },
  {
    key: 'ilvl',
    name: 'Илвл',
  },
  {
    key: 'covenant',
    name: 'Ковенант',
  },
  {
    key: 'soulbind',
    name: 'Медиум',
  },
];

const createRows = (profiles) => profiles.reduce((previous, profile) => {
  const ilvls = profile.equippedItems
    .filter((v) => !(v.inventoryType.type === 'SHIRT'
        || v.inventoryType.type === 'TABARD'
        || v.inventoryType.type === 'BODY'))
    // двуручное считается за 2 одноручные, кроме армсов
    .map((v) => Number(v.level.value)
      * ((v.inventoryType.type === 'TWOHWEAPON'
        && _.filter(profile.equippedItems, (i) => i.inventoryType.type === 'TWOHWEAPON').length !== 2)
      || v.inventoryType.type === 'RANGEDRIGHT' ? 2 : 1));
    // TODO colors ?
  const { specialization: { name: specName } } = profile.specialization || { specialization: { name: '' } };
  const { name: covenantName = '' } = profile.chosenCovenant || {};
  const { soulbinds } = profile;
  const activeSoulbind = soulbinds
    ? (soulbinds.find((v) => v.isActive) || { soulbind: { name: '' } }).soulbind.name
    : '';
  const row = {
    name: profile.name,
    rank: rankConverter(profile.rank),
    race: raceConverter(profile.race),
    class: classConverter(profile.characterClass),
    spec: specName,
    ilvl: ilvls.length > 0 ? (_.sum(ilvls) / 16).toFixed(2) : '',
    covenant: covenantName,
    soulbind: activeSoulbind,
    rankSort: profile.rank,
  };
  previous.push(row);
  return previous;
}, []);

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
    case 'rank':
      sortedRows = _.orderBy(sortedRows, ['rankSort']);
      break;
    default:
  }
  return sortDirection === 'DESC' ? sortedRows.reverse() : sortedRows;
};

const ProfileTable = () => {
  const { data: { all: profiles = [] } = {}, loading } = useProfilesQuery();
  const [[sortColumn, sortDirection], setSort] = useState(['name', 'NONE']);
  const rows = useMemo(() => createRows(profiles), [profiles]);
  const sortedRows = useMemo(() => sortRows(sortColumn, sortDirection, rows),
    [sortColumn, sortDirection, rows]);
  const handleSort = useCallback((columnKey, direction) => {
    setSort([columnKey, direction]);
  }, []);

  return (
    <Table
      columns={columns}
      rows={sortedRows}
      tableName="gearTable"
      loading={loading}
      defaultColumnOptions={{
        sortable: true,
        resizable: true,
      }}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={handleSort}
      className="fill-grid"
    />
  );
};

export default ProfileTable;
