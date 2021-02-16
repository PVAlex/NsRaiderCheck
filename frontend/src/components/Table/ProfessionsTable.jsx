import React, { useCallback, useMemo, useState } from 'react';
import { useProfessionsQuery } from '@ns/apollo';
import _ from 'lodash';
import { rankConverter } from '@ns/support';
import ProgressCell from './ProgressCell';
import Table from './Table';

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
    key: 'primary1',
    name: 'Профессия',
    sortable: true,
    width: 450,
  },
  {
    key: 'primary2',
    name: 'Профессия',
    sortable: true,
    width: 450,
  },
  {
    key: 'cooking',
    name: 'Кулинария',
    sortable: true,
  },
  {
    key: 'fishing',
    name: 'Рыбная ловля',
    sortable: true,
  },
  {
    key: 'archaeology',
    name: 'Археология',
    sortable: true,
  },
];

const shadowlandsProfessions = {
  2750: 'Алхимия',
  2751: 'Кузнечное дело',
  2752: 'Кулинария',
  2753: 'Наложение чар',
  2754: 'Рыбная ловля',
  2755: 'Инженерное дело',
  2756: 'Начертание',
  2757: 'Ювелирное дело',
  2758: 'Кожевничество',
  2759: 'Портяжное дело',
  2760: 'Травничество',
  2761: 'Горное дело',
  2762: 'Снятие шкур',
};

const createRows = (profiles) => profiles.reduce((prev, value) => {
  const row = {};
  (value.primaryProfessions || []).forEach((v, i) => {
    const tier = _.find(v.tiers, (t) => (
      Object.keys(shadowlandsProfessions).map((key) => Number(key)).includes(t.tier.id)
    ));
    if (tier) {
      row[`primary${i + 1}`] = (
        <ProgressCell
          max={tier.maxSkillPoints}
          current={tier.skillPoints}
          text={shadowlandsProfessions[tier.tier.id]}
        />
      );
      row[`primary${i + 1}Sort`] = [shadowlandsProfessions[tier.tier.id], tier.skillPoints];
    }
  });
  (value.secondaryProfessions || []).forEach((v) => {
    let tier;
    switch (v.profession.name) {
      case ('Cooking'):
      case ('Fishing'):
        tier = _.find(v.tiers, (t) => (
          Object.keys(shadowlandsProfessions).map((key) => Number(key)).includes(t.tier.id)
        ));
        if (tier) {
          const name = v.profession.name.toLowerCase();
          row[name] = (
            <ProgressCell
              max={tier.maxSkillPoints}
              current={tier.skillPoints}
            />
          );
          row[`${name}Sort`] = tier.skillPoints;
        }
        break;
      case ('Archaeology'):
        row.archaeology = (
          <ProgressCell
            max={v.maxSkillPoints}
            current={v.skillPoints}
          />
        );
        row.archaeologySort = v.skillPoints;
        break;
      default:
    }
  });
  row.name = value.name;
  row.rank = rankConverter(value.rank);
  row.rankSort = value.rank;
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
    case 'primary1':
      sortedRows = _.orderBy(sortedRows,
        [
          ({ primary1Sort }) => (primary1Sort || [null, 0])[0] || null,
          ({ primary1Sort }) => (primary1Sort || ['', 0])[1] || '',
        ],
        ['asc', 'desc']);
      break;
    case 'primary2':
      sortedRows = _.orderBy(sortedRows,
        [
          ({ primary2Sort }) => (primary2Sort || [null, 0])[0] || null,
          ({ primary2Sort }) => (primary2Sort || ['', 0])[1] || '',
        ],
        ['asc', 'desc']);
      break;
    case 'cooking':
      sortedRows = _.orderBy(sortedRows,
        ({ cookingSort }) => cookingSort || '',
        ['desc']);
      break;
    case 'fishing':
      sortedRows = _.orderBy(sortedRows,
        ({ fishingSort }) => fishingSort || '',
        ['desc']);
      break;
    case 'archaeology':
      sortedRows = _.orderBy(sortedRows,
        ({ archaeologySort }) => archaeologySort || '',
        ['desc']);
      break;
    default:
  }
  return sortDirection === 'DESC' ? sortedRows.reverse() : sortedRows;
};

const ProfessionsTable = () => {
  const { profiles, loading } = useProfessionsQuery();
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
      tableName="professionsTable"
      columns={columns}
      loading={loading}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={handleSort}
    />
  );
};

export default ProfessionsTable;
