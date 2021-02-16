import { makeStyles } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useLayoutEffect, useMemo } from 'react';
import DataGrid from 'react-data-grid';
import './table.scss';
import { useTable } from '@ns/redux';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

const useStyles = makeStyles(() => ({
  wrapper: {
    padding: '0 8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: '100%',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  expander: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
}));

const CellValueWrapper = ({ value, classNames, children }) => {
  return (
    <div className={classNames.join(' ')}>
      {children
        ? (
          <>
            {children}
            <div>{value}</div>
          </>
        )
        : value}
    </div>
  );
};

CellValueWrapper.propTypes = {
  classNames: PropTypes.arrayOf(PropTypes.any).isRequired,
  value: PropTypes.any,
  children: PropTypes.node,
};

CellValueWrapper.defaultProps = {
  value: '',
  children: null,
};

const Table = ({
  columns, rows, tableName, treeView, loading, ...props
}) => {
  const { expand, toggleRow } = useTable(tableName);
  const classes = useStyles();

  // Columns
  const getExpandFormatter = (column) => {
    const { row = { props: {} } } = column;
    const { value } = (row.name || {}).props || {};
    const isExpanded = expand[value] || false;
    const handleClick = () => toggleRow(value);
    return (
      <CellValueWrapper value={value} classNames={[classes.wrapper, classes.expander]}>
        { value && (
          isExpanded
            ? <KeyboardArrowDownIcon onClick={handleClick} />
            : <KeyboardArrowRightIcon onClick={handleClick} />
        )}
      </CellValueWrapper>
    );
  };
  const wrappedColumns = useMemo(() => {
    const c = columns.map((value) => (value.name
      ? ({
        ...value,
        name: <CellValueWrapper value={value.name} classNames={[classes.wrapper]} />,
      })
      : value));
    if (treeView) {
      _.find(c, (o) => o.key === 'name').formatter = getExpandFormatter;
    }
    return c;
  }, [expand, columns]);

  // Rows
  const wrappedRows = useMemo(() => rows.map((row) => Object
    .keys(row).reduce((previous, key) => {
      const v = row[key];
      const value = (v && v.value) || v;
      const className = (v && v.style) || '';
      const { children } = v || {};
      const result = {
        ...previous,
        [key]: <CellValueWrapper
          value={value}
          classNames={[classes.wrapper, className]}
        />,
      };
      if (children) {
        result.children = children.reduce((prev, child, index) => {
          const e = (result.children || []).length > index ? result.children[index] : {};
          e[key] = <CellValueWrapper value={child} classNames={[classes.wrapper]} />;
          return [...prev, e];
        }, []);
      }
      return result;
    }, {})), [rows]);
  const treeRows = useMemo(() => treeView && wrappedRows.reduce((previous, row) => {
    if (row.children && expand[row.name.props.value]) {
      const children = row.children.length > 1 ? _.slice(row.children, 1) : [];
      return [...previous, row, ...children];
    }
    return [...previous, row];
  }, []), [expand, wrappedRows]);

  const refreshLinks = () => {
    const { $WowheadPower } = window;
    if (typeof $WowheadPower !== 'undefined') {
      try {
        $WowheadPower.refreshLinks();
      } catch (e) {
        // DO NOTHING
      }
    }
  };

  useLayoutEffect(() => {
    refreshLinks();
  });
  return (
    <>
      { loading
        ? (<LoadingIndicator />)
        : (
          <DataGrid
            columns={wrappedColumns}
            rows={treeRows || wrappedRows}
            onScroll={refreshLinks}
            {...props}
          />
        )
      }
    </>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  rows: PropTypes.arrayOf(PropTypes.any).isRequired,
  tableName: PropTypes.string.isRequired,
  treeView: PropTypes.bool,
  loading: PropTypes.bool,
};

Table.defaultProps = {
  treeView: false,
  loading: false,
};

export default Table;
