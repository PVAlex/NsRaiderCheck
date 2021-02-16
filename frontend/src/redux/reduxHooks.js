import { useDispatch, useSelector } from 'react-redux';
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
