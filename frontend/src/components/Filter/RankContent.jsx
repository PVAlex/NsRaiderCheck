import {
  Checkbox, FormGroup, FormControlLabel, makeStyles,
} from '@material-ui/core';
import React from 'react';
import { ranks } from '@ns/support';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  form: {
    margin: '0px 10px 0px 10px',
  },
}));

const RankContent = ({ rank, setRank }) => {
  const classes = useStyles();
  return (
    <FormGroup className={classes.form}>
      {
        Object.keys(ranks)
          .map((k) => {
            const key = Number.parseInt(k);
            const handleClick = () => {
              if (rank.includes(key)) {
                setRank(rank.filter((value) => value !== key));
              } else {
                setRank([...rank, key]);
              }
            };
            return (
              <FormControlLabel
                key={`rank-${key}`}
                control={(
                  <Checkbox
                    color="primary"
                    onChange={handleClick}
                    checked={rank.includes(key)}
                  />
)}
                label={ranks[key]}
              />
            );
          })
      }
    </FormGroup>
  );
};

RankContent.propTypes = {
  rank: PropTypes.arrayOf(PropTypes.number).isRequired,
  setRank: PropTypes.func.isRequired,
};

export default RankContent;
