import { Grid, makeStyles } from '@material-ui/core';
import _ from 'lodash';
import React from 'react';
import { useRioQuery } from '@ns/apollo';
import Filter from '../Filter/Filter';
import Table from './Table';
import { RIO_TABLE } from './tableName';

const useStyles = makeStyles({
  container: {
    height: 'inherit',
  },
  mythic: {
    display: 'flex',
  },
  mythicName: {
    flexGrow: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

const columns = [
  {
    key: 'name',
    name: 'Имя',
    sortable: true,
    frozen: true,
    width: 150,
  },
  {
    key: 'rio',
    name: 'RIO',
    width: 100,
    sortable: true,
  },
  {
    key: 'thisWeek',
    name: 'Текущая неделя',
    sortable: true,
  },
  {
    key: 'lastWeek',
    name: 'Прошлая неделя',
    sortable: true,
  },
  {
    key: 'best',
    name: 'Лучшие',
  },
];

const RioTable = () => {
  const classes = useStyles();
  const createRio = (mythic, showCount) => {
    if (!mythic || mythic.length === 0) return null;
    const count = mythic.length;
    const getValue = (value) => `[+${value.mythicLevel}]${value.dungeon}`;
    return {
      value: (
        <div className={`${classes.mythic}`}>
          <div className={`${classes.mythicName}`}>
            {getValue(mythic[0])}
          </div>
          {
            showCount && (
              <div>
                {`${count}/10`}
              </div>
            )
          }
        </div>),
      children: mythic.map((val) => getValue(val)),
    };
  };

  const createRow = (value) => {
    const thisWeekCount = (!value.mythicWeeklyHighest || value.mythicWeeklyHighest.length === 0)
      ? 0
      : value.mythicWeeklyHighest.length;
    const lastWeekCount = (!value.mythicLastWeek || value.mythicLastWeek.length === 0)
      ? 0
      : value.mythicLastWeek.length;
    return {
      name: value.name,
      rio: value.mythicScore,
      thisWeek: createRio(value.mythicWeeklyHighest, true),
      lastWeek: createRio(value.mythicLastWeek, true),
      best: createRio(value.mythicMax),
      rankSort: value.rank,
      thisWeekSort: thisWeekCount,
      lastWeekSort: lastWeekCount,
    };
  };

  const sortRows = (sortColumn, sortDirection, rows) => {
    if (sortDirection === 'NONE') return rows;
    let sortedRows = [...rows];
    switch (sortColumn) {
      case 'name':
        sortedRows = _.orderBy(sortedRows, [sortColumn], ['asc']);
        break;
      case 'rio':
        sortedRows = _.orderBy(sortedRows, [sortColumn], ['desc']);
        break;
      case 'thisWeek':
      case 'lastWeek':
        sortedRows = _.orderBy(sortedRows, [`${sortColumn}Sort`], ['desc']);
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

  const { loading, profiles } = useRioQuery();

  return (
    <Grid className={classes.container} container wrap="nowrap" direction="column">
      <Filter tableName={RIO_TABLE} />
      <Table
        values={profiles}
        columns={columns}
        rowRenderer={createRow}
        onFilter={filterRows}
        onSort={sortRows}
        tableName={RIO_TABLE}
        loading={loading}
        treeView
      />
    </Grid>
  );
};

export default RioTable;
