import { TOGGLE_ROW } from '../types';

export const toggleRow = (tableName, name) => (
  (dispatch) => dispatch({ type: TOGGLE_ROW, tableName, payload: { name } })
);
