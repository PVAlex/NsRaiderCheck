import { TOGGLE_ROW } from '../types';

const toggleRow = (tableName, name) => (
  (dispatch) => dispatch({ type: TOGGLE_ROW, tableName, payload: { name } })
);

export { toggleRow };
