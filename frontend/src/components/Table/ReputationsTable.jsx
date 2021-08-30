import { Grid, makeStyles } from '@material-ui/core';
import _ from 'lodash';
import React from 'react';
import { useReputationsQuery } from '../../apollo';
import Filter from '../Filter/Filter';
import ProgressCell from './cell/ProgressCell';
import Table from './Table';
import { REPUTATIONS_TABLE } from './tableName';

const useStyles = makeStyles({
  container: {
    height: 'inherit',
  },
});

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
    key: '2472',
    name: 'Кодекс архивариуса',
    sortable: true,
    width: tableWidth,
  },
  {
    key: '2470',
    name: 'Легион Смерти',
    sortable: true,
    width: tableWidth,
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

const createRow = (profile) => {
  const row = {
    name: profile.name,
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
  return row;
};

const sortRows = (sortColumn, sortDirection, rows) => {
  if (sortDirection === 'NONE') return rows;
  let sortedRows = [...rows];
  switch (sortColumn) {
    case 'name':
      sortedRows = _.orderBy(sortedRows, [sortColumn]);
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
    case '2472':
    case '2470':
      sortedRows = _.orderBy(sortedRows, [(row) => row[`${sortColumn}Sort`] || ''], ['desc']);
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

const ReputationsTable = () => {
  const classes = useStyles();
  const { profiles, loading } = useReputationsQuery();

  return (
    <Grid className={classes.container} container wrap="nowrap" direction="column">
      <Filter tableName={REPUTATIONS_TABLE} />
      <Table
        values={profiles}
        rowRenderer={createRow}
        onFilter={filterRows}
        onSort={sortRows}
        tableName={REPUTATIONS_TABLE}
        columns={columns}
        loading={loading}
      />
    </Grid>
  );
};

export default ReputationsTable;
