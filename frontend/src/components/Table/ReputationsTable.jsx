import _ from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { useReputationsQuery } from '../../apollo';
import { rankConverter } from '../../support';
import ProgressCell from './ProgressCell';
import Table from './Table';

const tableWidth = 300;

const columns = [
  {
    key: 'name',
    name: 'Имя',
    frozen: true,
    sortable: true,
    width: 150,
  },
  {
    key: 'rank',
    name: 'Ранг',
    sortable: true,
    width: 150,
  },
  {
    key: '2410',
    name: 'Неумирающая армия',
    sortable: true,
    width: tableWidth,
  },
  {
    key: '2413',
    name: 'Двор жнецов',
    sortable: true,
    width: tableWidth,
  },
  {
    key: '2407',
    name: 'Перерождённые',
    sortable: true,
    width: tableWidth,
  },
  {
    key: '2465',
    name: 'Дикая охота',
    sortable: true,
    width: tableWidth,
  },
  {
    key: '2432',
    name: 'Ве\'нари',
    sortable: true,
    width: tableWidth,
  },
  {
    key: '2464',
    name: 'Двор ночи',
    sortable: true,
    width: tableWidth,
  },
  {
    key: '2439',
    name: 'Нераскаявшиеся',
    sortable: true,
    width: tableWidth,
  },
  {
    key: '2445',
    name: 'Пепельный двор',
    sortable: true,
    width: tableWidth,
  },
  {
    key: '2462',
    name: 'Штопальщики',
    sortable: true,
    width: tableWidth,
  },
];

const createRows = (profiles) => profiles.reduce((prev, profile) => {
  const row = {
    name: profile.name,
    rank: rankConverter(profile.rank),
    rankSort: profile.rank,
  };
  (profile.reputations || []).forEach((reputation) => {
    row[reputation.faction.id] = (
      <ProgressCell
        max={reputation.standing.max}
        current={reputation.standing.value}
        text={reputation.standing.name}
      />
    );
    row[`${reputation.faction.id}Sort`] = reputation.standing.raw;
  });
  return [...prev, row];
}, []);

const sortRows = (sortColumn, sortDirection, rows) => {
  if (sortDirection === 'NONE') return rows;
  let sortedRows = [...rows];
  switch (sortColumn) {
    case 'name':
      sortedRows = _.orderBy(sortedRows, [sortColumn]);
      break;
    case 'rank':
      sortedRows = _.orderBy(sortedRows, ['rankSort']);
      break;
    case '2439':
    case '2464':
    case '2413':
    case '2407':
    case '2410':
    case '2445':
    case '2432':
    case '2465':
    case '2462':
      sortedRows = _.orderBy(sortedRows, [(row) => row[`${sortColumn}Sort`] || ''], ['desc']);
      break;
    default:
  }
  return sortDirection === 'DESC' ? sortedRows.reverse() : sortedRows;
};

const ReputationsTable = () => {
  const { profiles, loading } = useReputationsQuery();
  const [[sortColumn, sortDirection], setSort] = useState(['name', 'NONE']);
  const rows = useMemo(() => createRows(profiles), [profiles]);
  const sortedRows = useMemo(() => sortRows(sortColumn, sortDirection, rows),
    [sortColumn, sortDirection, rows]);
  const handleSort = useCallback((columnKey, direction) => {
    setSort([columnKey, direction]);
  }, []);

  return (
    <Table
      rows={sortedRows}
      tableName="reputationsTable"
      columns={columns}
      loading={loading}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={handleSort}
    />
  );
};

export default ReputationsTable;
