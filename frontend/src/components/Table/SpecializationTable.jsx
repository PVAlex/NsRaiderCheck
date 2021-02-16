import _ from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { useSpecializationQuery } from '@ns/apollo';
import { rankConverter } from '../../support';
import WhSpellTooltip from '../Wowhead/WhSpellTooltip';
import Table from './Table';

const talentWidth = 200;

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
    key: 'spec',
    name: 'Специализация',
    sortable: true,
    width: 150,
  },
  {
    key: 't0',
    name: 'T1',
    width: talentWidth,
  },
  {
    key: 't1',
    name: 'T2',
    width: talentWidth,
  },
  {
    key: 't2',
    name: 'T3',
    width: talentWidth,
  },
  {
    key: 't3',
    name: 'T4',
    width: talentWidth,
  },
  {
    key: 't4',
    name: 'T5',
    width: talentWidth,
  },
  {
    key: 't5',
    name: 'T6',
    width: talentWidth,
  },
  {
    key: 't6',
    name: 'T7',
    width: talentWidth,
  },
  {
    key: 'pvp0',
    name: 'PVP1',
    width: talentWidth,
  },
  {
    key: 'pvp1',
    name: 'PVP2',
    width: talentWidth,
  },
  {
    key: 'pvp2',
    name: 'PVP3',
    width: talentWidth,
  },
];

const createRows = (profiles) => profiles.reduce((previous, value) => {
  const t = (value.specialization || { talents: [] }).talents
    .reduce((p, v) => {
      const { spell: { name: tName, id: tId } } = v.spellTooltip
      || { spell: { name: null, id: null } };
      return {
        [`t${v.tierIndex}`]: tId !== null && tName !== null
          ? <WhSpellTooltip spellId={tId} name={tName} />
          : '',
        ...p,
      };
    }, {});
  const pvp = (value.specialization || { pvpTalentSlots: [] }).pvpTalentSlots
    .reduce((p, v, index) => {
      const { spellTooltip: { spell: { name: pName, id: pId } } } = v.selected
        || { spellTooltip: { spell: { name: null, id: null } } };
      return {
        [`pvp${index}`]: pId !== null && pName !== null
          ? <WhSpellTooltip name={pName} spellId={pId} />
          : '',
        ...p,
      };
    }, {});
  previous.push({
    name: value.name,
    rank: rankConverter(value.rank),
    spec: (value.specialization || { specialization: { name: null } }).specialization.name,
    rankSort: value.rank,
    ...t,
    ...pvp,
  });
  return previous;
}, []);

const sortRows = (sortColumn, sortDirection, rows) => {
  if (sortDirection === 'NONE') return rows;
  let sortedRows = [...rows];
  switch (sortColumn) {
    case 'name':
    case 'spec':
      // sortedRows = sortedRows.sort((a, b) => a[sortColumn].localeCompare(b[sortColumn]));
      sortedRows = _.orderBy(sortedRows, [sortColumn]);
      break;
    case 'rank':
      sortedRows = _.orderBy(sortedRows, ['rankSort']);
      break;
    default:
  }
  return sortDirection === 'DESC' ? sortedRows.reverse() : sortedRows;
};

const SpecializationTable = () => {
  const { loading, profiles } = useSpecializationQuery();
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
      tableName="specializationTable"
      loading={loading}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={handleSort}
    />
  );
};

export default SpecializationTable;
