import { makeStyles } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {
  useCallback, useMemo, useState,
} from 'react';
import DataGrid from 'react-data-grid';
import { useFilter, useTable } from '@ns/redux';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    '& .rdg-cell': {
      padding: 0,
    },
  },
  row: {
  },
  treeRow: {
    backgroundColor: 'hsl(0deg 0% 96%)',
  },
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
  columns, tableName, treeView, loading, rowRenderer, onSort, onFilter, values,
}) => {
  const { expand, toggleRow } = useTable(tableName);
  const { filter } = useFilter(tableName);
  const classes = useStyles();

  const [sortColumns, setSort] = useState([]);
  const { columnKey: sortColumn, direction: sortDirection } = sortColumns[0] || { sortColumn: 'name', sortDirection: 'NONE' };
  const rows = useMemo(() => (values || []).reduce((prev, value) => {
    const row = rowRenderer(value);
    return [...prev, row];
  }, []), [values]);
  const filteredRows = useMemo(() => onFilter(filter, rows), [filter, rows]);
  const sortedRows = useMemo(() => onSort(sortColumn, sortDirection, filteredRows),
    [sortColumn, sortDirection, filteredRows]);
  const handleSort = useCallback((sort) => {
    setSort(sort.slice(-1));
  }, []);

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
  const wrappedRows = useMemo(() => sortedRows.map((row) => Object
    .keys(row).reduce((previous, key) => {
      const v = row[key];
      const value = (v?.value ?? v);
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
    }, {})), [sortedRows]);
  const treeRows = useMemo(() => treeView && wrappedRows.reduce((previous, row) => {
    if (row.children && expand[row.name.props.value]) {
      const children = row.children.length > 1
        ? _.slice(row.children, 1).reduce((prev, value) => [...prev, { ...value, tree: true }], [])
        : [];
      return [...previous, row, ...children];
    }
    return [...previous, row];
  }, []), [expand, wrappedRows]);

  // const refreshLinks = () => {
  //   const { $WowheadPower } = window;
  //   if (typeof $WowheadPower !== 'undefined') {
  //     try {
  //       $WowheadPower.refreshLinks();
  //     } catch (e) {
  //       // DO NOTHING
  //     }
  //   }
  // };
  //
  // useLayoutEffect(() => {
  //   refreshLinks();
  // });
  const rowStyle = (row) => (row.tree ? classes.treeRow : classes.row);
  return (
    <>
      { loading
        ? (<LoadingIndicator />)
        : (
          <DataGrid
            className={classes.root}
            rowClass={rowStyle}
            columns={wrappedColumns}
            rows={treeRows || wrappedRows}
            // onScroll={refreshLinks}
            sortColumns={sortColumns}
            onSortColumnsChange={handleSort}
          />
        )}
    </>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  values: PropTypes.arrayOf(PropTypes.any).isRequired,
  tableName: PropTypes.string.isRequired,
  treeView: PropTypes.bool,
  loading: PropTypes.bool,
  onFilter: PropTypes.func,
  onSort: PropTypes.func,
  rowRenderer: PropTypes.func,
};

Table.defaultProps = {
  treeView: false,
  loading: false,
  onFilter: (filter, rows) => rows,
  onSort: (sortColumn, sortDirection, rows) => rows,
  rowRenderer: (row) => row,
};

export default Table;
