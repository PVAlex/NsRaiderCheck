import { Grid, makeStyles } from '@material-ui/core';
import { classConverter } from '@ns/support/converters';
import _ from 'lodash';
import React from 'react';
import { useSpecializationQuery } from '@ns/apollo';
import Filter from '../Filter/Filter';
import KyrianIcon from '../icons/KyrianIcon';
import NecrolordIcon from '../icons/NecrolordIcon';
import NightFaeIcon from '../icons/NightFaeIcon';
import VenthyrIcon from '../icons/VenthyrIcon';
import WhSpellTooltip from '../Wowhead/WhSpellTooltip';
import Table from './Table';
import { SPECIALIZATIONS_TABLE } from './tableName';

const useStyles = makeStyles({
  container: {
    height: 'inherit',
  },
  icons: {
    display: 'flex',
    alignItems: 'center',
    height: 'inherit',
    '& div,a,img': {
      marginRight: '1px',
    },
  },
  extraMargin: {
    '& div,a,img': {
      marginRight: '5px',
    },
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
    key: 'class',
    name: 'Класс',
    sortable: true,
    width: 150,
  },
  {
    key: 'spec',
    name: 'Специализация',
    sortable: true,
    width: 200,
  },
  {
    key: 'covenant',
    name: 'Ковенант',
    sortable: true,
    width: 200,
  },
  {
    key: 'talents',
    name: 'Таланты',
  },
  {
    key: 'pvp',
    name: 'PVP',
  },
  {
    key: 'conduits',
    name: 'Проводники',
  },
  {
    key: 'traits',
    name: 'Трейты',
  },
];

const SpecializationTable = () => {
  const classes = useStyles();

  const createRow = (value) => {
    // Covenant
    let covenantIcon;
    switch (value.chosenCovenant?.id || 0) {
      case 1:
        covenantIcon = <KyrianIcon />;
        break;
      case 2:
        covenantIcon = <VenthyrIcon />;
        break;
      case 3:
        covenantIcon = <NightFaeIcon />;
        break;
      case 4:
        covenantIcon = <NecrolordIcon />;
        break;
      default:
        covenantIcon = null;
    }
    const covenant = (
      <div className={`${classes.icons} ${classes.extraMargin}`}>
        {covenantIcon}
        <span>{ ` ${value.chosenCovenant?.name || ''}` }</span>
      </div>
    );

    // Talents
    const talents = [0, 1, 2, 3, 4, 5, 6].reduce((p, i) => {
      const v = _.find((value.specialization || { talents: [] }).talents, { tierIndex: i })
      || { spellTooltip: null };
      const { name: tName, id: tId } = v.spellTooltip?.spell
      || { name: null, id: null };
      const { value: icon } = v.spellTooltip?.icon
      || { value: null };
      return [...p, <WhSpellTooltip key={`t${i}`} spellId={tId} name={tName} iconOnly icon={icon} showIcon />];
    }, []);

    // PvP talents
    const pvp = [2, 3, 4].reduce((p, i) => {
      const v = _.find((value.specialization || { pvpTalentSlots: [] }).pvpTalentSlots,
        { slotNumber: i })
      || { selected: { spellTooltip: {} } };
      const { name: pName, id: pId } = v.selected?.spellTooltip?.spell
      || { name: null, id: null };
      const { value: icon } = v.selected?.spellTooltip?.icon
      || { value: null };
      return [...p, <WhSpellTooltip key={`p${i}`} name={pName} spellId={pId} iconOnly icon={icon} showIcon />];
    }, []);

    const soulbind = _.find(value.soulbinds, { isActive: true });
    // Traits
    const traits = soulbind?.traits
      .filter((v) => v.trait !== null && v.spell?.spell !== null)
      .reduce((p, v, i) => {
        const { name: tName, id: tId } = v.spell?.spell
        || { name: null, id: null };
        const { value: icon } = v.spell?.icon
        || { value: null };
        return [
          ...p,
          <WhSpellTooltip
            key={`t${i}`}
            name={tName}
            spellId={tId}
            iconOnly
            icon={icon}
            showIcon
          />,
        ];
      }, []);

    // Conduits
    const conduits = soulbind?.traits
      .filter((v) => v.conduitSocket !== null && v.spell?.spell !== null)
      .reduce((p, v, i) => {
        const { name: pName, id: pId } = v.spell?.spell
        || { name: null, id: null };
        const { value: icon } = v.spell?.icon
        || { value: null };
        return [
          ...p,
          <WhSpellTooltip
            key={`c${i}`}
            name={pName}
            spellId={pId}
            iconOnly
            icon={icon}
            showIcon
          />,
        ];
      }, []);

    return {
      name: value.name,
      class: classConverter(value.characterClass),
      spec: (value.specialization || { specialization: { name: null } }).specialization.name,
      rankSort: value.rank,
      covenant,
      covenantSort: value.chosenCovenant?.name || null,
      talents: <div className={classes.icons}>{talents}</div>,
      pvp: <div className={classes.icons}>{pvp}</div>,
      traits: <div className={classes.icons}>{traits}</div>,
      conduits: <div className={classes.icons}>{conduits}</div>,
    };
  };

  const sortRows = (sortColumn, sortDirection, rows) => {
    if (sortDirection === 'NONE') return rows;
    let sortedRows = [...rows];
    switch (sortColumn) {
      case 'name':
      case 'spec':
      case 'class':
        // sortedRows = sortedRows.sort((a, b) => a[sortColumn].localeCompare(b[sortColumn]));
        sortedRows = _.orderBy(sortedRows, [sortColumn]);
        break;
      case 'covenant':
        sortedRows = _.orderBy(sortedRows, [`${sortColumn}Sort`]);
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

  const { loading, profiles } = useSpecializationQuery();

  return (
    <Grid component="div" className={classes.container} container wrap="nowrap" direction="column">
      <Filter tableName={SPECIALIZATIONS_TABLE} />
      <Table
        values={profiles}
        rowRenderer={createRow}
        onFilter={filterRows}
        onSort={sortRows}
        columns={columns}
        tableName={SPECIALIZATIONS_TABLE}
        loading={loading}
      />
    </Grid>
  );
};

export default SpecializationTable;
