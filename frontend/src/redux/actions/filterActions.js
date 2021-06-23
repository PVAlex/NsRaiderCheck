import { SAVE_FILTER } from '../types';

export const saveFilter = (tableName, filter) => (
  (dispatch) => dispatch({ type: SAVE_FILTER, tableName, payload: { filter } })
);
