import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Grid, IconButton, Input, InputAdornment, makeStyles, Popover,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useFilter } from '@ns/redux';
import RankContent from './RankContent';

const useStyles = makeStyles((theme) => ({
  applyButton: {
    ...theme.applyButton,
  },
  textFiled: {
    width: '500px',
  },
}));

const DefaultPopoverContent = ({ tableName }) => {
  const classes = useStyles();
  const { filter, saveFilter } = useFilter(tableName);
  const [rank, setRank] = useState(filter.rankSort);
  const handleClick = () => saveFilter({ rankSort: rank });
  return (
    <>
      <RankContent rank={rank} setRank={setRank} />
      <Button className={classes.applyButton} onClick={handleClick}>Применить</Button>
    </>
  );
};

DefaultPopoverContent.propTypes = {
  tableName: PropTypes.string.isRequired,
};

const Filter = ({ tableName, popoverContent }) => {
  const classes = useStyles();
  const { filter, saveFilter } = useFilter(tableName);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleFilterClick = (event) => setAnchorEl(event.currentTarget);
  const handlePopoverClose = () => setAnchorEl(null);
  const handleChange = useCallback((event) => {
    const text = event.target.value;
    handlePopoverClose();
    if (text) {
      saveFilter({ ...filter, name: text.split(/,|\s+/).filter((s) => s).map((s) => s.trim().toLowerCase()) });
    } else {
      saveFilter({ ...filter, name: null });
    }
  }, [filter.name]);
  const open = Boolean(anchorEl);
  return (
    <Grid>
      <Input
        className={classes.textFiled}
        placeholder="Поиск"
        ariant="outlined"
        onChange={handleChange}
        defaultValue={filter.name}
        endAdornment={<InputAdornment position="end"><SearchIcon /></InputAdornment>}
      />
      <IconButton onClick={handleFilterClick}>
        <FontAwesomeIcon icon={faFilter} />
      </IconButton>
      <Popover
        open={open}
        onClose={handlePopoverClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Grid container direction="column">
          {popoverContent || <DefaultPopoverContent tableName={tableName} />}
        </Grid>
      </Popover>
    </Grid>
  );
};

Filter.propTypes = {
  tableName: PropTypes.string.isRequired,
  popoverContent: PropTypes.element,
};

Filter.defaultProps = {
  popoverContent: null,
};

export default Filter;
