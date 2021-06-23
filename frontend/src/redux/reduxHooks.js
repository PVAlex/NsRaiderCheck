import { useDispatch, useSelector } from 'react-redux';
import { saveFilter } from './actions/filterActions';
import { toggleRow } from './actions/tableActions';

// eslint-disable-next-line import/prefer-default-export
export const useTable = (tableName) => {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.table[tableName]);
  return {
    ...state,
    dispatch,
    toggleRow: (name) => dispatch(toggleRow(tableName, name)),
  };
};

export const useFilter = (tableName) => {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.filter[tableName]);
  return {
    filter: state,
    dispatch,
    saveFilter: (filter) => dispatch(saveFilter(tableName, filter)),
    resetField: () => dispatch(resetField(tableName)),
  };
};
