import { Divider, FormGroup, Checkbox, Button, FormControlLabel, makeStyles } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { useFilter } from '@ns/redux';
import { GEAR_TABLE } from '@ns/components/Table/tableName';
import Filter from './Filter';
import RankContent from './RankContent';

const useStyles = makeStyles((theme) => ({
  applyButton: {
    ...theme.applyButton,
  },
  form: {
    margin: '0px 10px 0px 10px',
  },
}));

const GearPopoverContent = () => {
  const classes = useStyles();
  const { filter, saveFilter } = useFilter(GEAR_TABLE);
  const [rank, setRank] = useState(filter.rankSort);
  const [hasFail, setFail] = useState(filter.hasFail);
  const handleApply = useCallback(() => (
    saveFilter({ ...filter, rankSort: rank, hasFail })
  ), [rank, hasFail]);
  return (
    <>
      <RankContent rank={rank} setRank={setRank} />
      <Divider />
      <FormGroup className={classes.form}>
        <FormControlLabel
          key="fail"
          control={<Checkbox color="primary" checked={hasFail} onChange={() => setFail(!hasFail)} />}
          label="Только с косяками"
        />
      </FormGroup>
      <Button className={classes.applyButton} onClick={handleApply} variant="contained">Применить</Button>
    </>
  );
};

const GearFilter = () => (
  <Filter
    tableName={GEAR_TABLE}
    popoverContent={<GearPopoverContent />}
  />
);

export default GearFilter;
