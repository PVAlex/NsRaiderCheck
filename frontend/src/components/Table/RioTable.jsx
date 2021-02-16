import { makeStyles } from '@material-ui/core';
import _ from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { useRioQuery } from '@ns/apollo';
import { rankConverter } from '@ns/support';
import Table from './Table';

const useStyles = makeStyles({
  mythic: {
    display: 'flex',
  },
  mythicName: {
    flexGrow: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

const getColumns = () => [
  {
    key: 'name',
    name: 'Имя',
    sortable: true,
    frozen: true,
    width: 150,
  },
  {
    key: 'rank',
    name: 'Ранг',
    sortable: true,
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

  const createRows = (profiles) => profiles.reduce((previous, value) => {
    const thisWeekCount = (!value.mythicWeeklyHighest || value.mythicWeeklyHighest.length === 0)
      ? 0
      : value.mythicWeeklyHighest.length;
    const lastWeekCount = (!value.mythicLastWeek || value.mythicLastWeek.length === 0)
      ? 0
      : value.mythicLastWeek.length;
    previous.push({
      name: value.name,
      rank: rankConverter(value.rank),
      rio: value.mythicScore,
      thisWeek: createRio(value.mythicWeeklyHighest, true),
      lastWeek: createRio(value.mythicLastWeek, true),
      best: createRio(value.mythicMax),
      rankSort: value.rank,
      thisWeekSort: thisWeekCount,
      lastWeekSort: lastWeekCount,
    });
    return previous;
  }, []);

  const sortRows = (sortColumn, sortDirection, rows) => {
    if (sortDirection === 'NONE') return rows;
    let sortedRows = [...rows];
    switch (sortColumn) {
      case 'name':
      case 'rio':
        sortedRows = _.orderBy(sortedRows, [sortColumn], ['desc']);
        break;
      case 'rank':
      case 'thisWeek':
      case 'lastWeek':
        sortedRows = _.orderBy(sortedRows, [`${sortColumn}Sort`], ['desc']);
        break;
      default:
    }
    return sortDirection === 'DESC' ? sortedRows.reverse() : sortedRows;
  };

  const { loading, profiles } = useRioQuery();
  const columns = useMemo(() => getColumns(), []);
  const [[sortColumn, sortDirection], setSort] = useState(['name', 'NONE']);
  const rows = useMemo(() => createRows(profiles), [profiles]);
  const sortedRows = useMemo(() => sortRows(sortColumn, sortDirection, rows),
    [sortDirection, sortColumn, rows]);
  const handleSort = useCallback((columnKey, direction) => {
    setSort([columnKey, direction]);
  }, []);

  return (
    <Table
      rows={sortedRows}
      columns={columns}
      tableName="rioTable"
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={handleSort}
      treeView
    />
  );
};

export default RioTable;
