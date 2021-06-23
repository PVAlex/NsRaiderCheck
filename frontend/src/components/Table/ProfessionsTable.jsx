import { Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { useProfessionsQuery } from '@ns/apollo';
import _ from 'lodash';
import { rankConverter } from '@ns/support';
import Filter from '../Filter/Filter';
import ProgressCell from './ProgressCell';
import Table from './Table';
import { PROFESSIONS_TABLE } from './tableName';

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

const createRows = (value) => {
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
  return row;
};

const sortRows = (sortColumn, sortDirection, rows) => {
  if (sortDirection === 'NONE') return rows;
  let sortedRows = [...rows];
  switch (sortColumn) {
    case 'name':
      sortedRows = _.orderBy(sortedRows, [sortColumn]);
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

const filterRows = (filter, rows) => {
  const { name, rankSort } = filter;
  return rows
    .filter((row) => !name || name.filter((n) => row.name.toLowerCase().startsWith(n)).length)
    .filter((row) => rankSort && rankSort.includes(row.rankSort));
};

const ProfessionsTable = () => {
  const classes = useStyles();
  const { profiles, loading } = useProfessionsQuery();

  return (
    <Grid className={classes.container} container wrap="nowrap" direction="column">
      <Filter tableName={PROFESSIONS_TABLE} />
      <Table
        values={profiles}
        columns={columns}
        rowRenderer={createRows}
        onFilter={filterRows}
        onSort={sortRows}
        tableName={PROFESSIONS_TABLE}
        loading={loading}
      />
    </Grid>
  );
};

export default ProfessionsTable;
