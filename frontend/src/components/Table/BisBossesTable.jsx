import { Grid, makeStyles } from '@material-ui/core';
import { useBisItemsQuery, useBisProfilesQuery } from '@ns/apollo/apolloHooks';
import { encounterConverter } from '@ns/support/converters';
import React, { useMemo } from 'react';
import _ from 'lodash';
import WhItemTooltip from '../Wowhead/WhItemTooltip';
import Table from './Table';
import { BIS_BOSSES_TABLE } from './tableName';

const useStyles = makeStyles({
  container: {
    height: 'inherit',
  },
});

const columns = [
  {
    key: 'name',
    name: 'Босс',
    width: 300,
    frozen: true,
  },
  {
    key: 'item',
    name: 'Предмет',
    width: 250,
    frozen: true,
  },
  {
    key: 'hQty',
    name: 'Героик',
    width: 50,
  },
  {
    key: 'hCharacters',
    name: 'Кому нужно',
    resizable: true,
    width: 800,
  },
  {
    key: 'mQty',
    name: 'Мифик',
    width: 50,
  },
  {
    key: 'mCharacters',
    name: 'Кому нужно',
    resizable: true,
    width: 800,
  },
];

const BisBossesTable = () => {
  const classes = useStyles();
  const { loading: profilesLoading, profiles } = useBisProfilesQuery();
  const { loading: itemsLoading, items } = useBisItemsQuery();
  const itemEncounterMap = items.reduce((p, v) => (
    {
      ...p,
      [v.item.item.id]: v.encounterId,
    }
  ), {});

  const bosses = useMemo(() => {
    if (!itemsLoading && !profilesLoading) {
      let sorted = {};
      profiles.forEach((profile) => profile.items.forEach((item) => {
        const encounterId = itemEncounterMap[item.itemId];
        const encounter = sorted[encounterId];

        // [0-hCharacters, 1-haCharacters, 2-mCharacters, 3-maCharacters]
        const getCharacters = (b, pos) => (b
          ? [
            ...encounter?.[item.itemId]?.characters[pos] || [],
            profile.name,
          ]
          : encounter?.[item.itemId]?.characters[pos] || []);
        const hCharacters = getCharacters(
          item.itemId !== item.currentItemId && item.ilvl < 239, 0,
        );
        const haCharacters = getCharacters(
          item.itemId !== item.currentItemId && item.ilvl >= 239 && item.ilvl < 252, 1,
        );
        const mCharacters = getCharacters(
          item.itemId !== item.currentItemId && item.ilvl < 252, 2,
        );
        const maCharacters = getCharacters(
          item.itemId !== item.currentItemId && item.ilvl >= 252, 3,
        );
        sorted = {
          ...sorted,
          [encounterId]: {
            ...encounter,
            [item.itemId]: {
              name: item.itemName,
              characters: [
                hCharacters, haCharacters, mCharacters, maCharacters,
              ],
            },
          },
        };
      }));
      return [2435, 2442, 2439, 2444, 2445, 2443, 2446, 2447, 2440, 2441]
        .filter((sKey) => sorted[sKey])
        .map((sKey) => {
          const enc = sKey;
          const values = sorted[sKey];
          const hQty = [];
          const haQty = [];
          const mQty = [];
          const maQty = [];
          const i = [];
          const hNames = [];
          const mNames = [];
          Object.keys(values)
            .forEach((vKey) => {
              const h = values[vKey].characters[0];
              const ha = values[vKey].characters[1];
              const m = values[vKey].characters[2];
              const ma = values[vKey].characters[3];
              if (!(h.length === 0 && ha.length === 0 && m.length === 0 && ma.length === 0)) {
                hQty.push(h.length);
                haQty.push(ha.length);
                mQty.push(m.length);
                maQty.push(ma.length);
                i.push(<WhItemTooltip itemId={Number(vKey)} itemName={values[vKey].name} />);
                hNames.push(_.uniq([...h, ...ha.map((s) => `${s}*`)])
                  .join(', '));
                mNames.push(_.uniq([...m, ...ma.map((s) => `${s}*`)])
                  .join(', '));
              }
            });
          const getQty = (arr1, arr2) => ({
            value: `${_.sum(arr1)}+${_.sum(arr2)}*`,
            children: [`${_.sum(arr1)}+${_.sum(arr2)}*`, ...arr1.map((v, index) => `${arr1[index]}+${arr2[index]}*`)],
          });
          return {
            name: encounterConverter(enc),
            hQty: getQty(hQty, haQty),
            hCharacters: {
              value: '',
              children: ['', ...hNames],
            },
            mQty: getQty(mQty, maQty),
            mCharacters: {
              value: '',
              children: ['', ...mNames],
            },
            item: {
              value: '',
              children: ['', ...i],
            },
          };
        });
    }
    return [];
  }, [profiles, items]);

  return (
    <Grid className={classes.container} container wrap="nowrap" direction="column">
      <Table
        values={bosses}
        tableName={BIS_BOSSES_TABLE}
        columns={columns}
        loading={profilesLoading || itemsLoading}
        treeView
      />
    </Grid>
  );
};

export default BisBossesTable;
