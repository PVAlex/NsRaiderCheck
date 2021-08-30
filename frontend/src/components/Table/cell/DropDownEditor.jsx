import { makeStyles, Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  select: {
    width: '-webkit-fill-available',
    fontSize: '14px',
  },
  emptyOption: {
    minHeight: '2rem',
  },
});

const DropDownEditor = ({ items, selected, onChange }) => {
  const classes = useStyles();
  const selectedValue = items.find((i) => i.text === selected)?.value || 0;
  return (
    <Select
      className={classes.select}
      onChange={onChange}
      value={selectedValue}
    >
      <MenuItem className={classes.emptyOption} value={0} />
      {
      items.map((item) => (
        <MenuItem value={item.value} key={item.value}>
          {item.text}
        </MenuItem>
      ))
    }
    </Select>
  );
};

DropDownEditor.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
  selected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DropDownEditor;
