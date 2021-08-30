import {
  BIS_EQUIPMENT_TABLE, COVENANT_TABLE, GEAR_TABLE, PROFESSIONS_TABLE,
  REPUTATIONS_TABLE, RIO_TABLE, SPECIALIZATIONS_TABLE, PROFILE_TABLE, BIS_BOSSES_TABLE,
} from '@ns/components/Table/tableName';
import { TOGGLE_ROW } from '../types';

const tableInitialState = {
  [BIS_EQUIPMENT_TABLE]: {},
  [BIS_BOSSES_TABLE]: {
    expand: {},
  },
  [COVENANT_TABLE]: {},
  [GEAR_TABLE]: {},
  [REPUTATIONS_TABLE]: {},
  [PROFESSIONS_TABLE]: {},
  [PROFILE_TABLE]: {},
  [RIO_TABLE]: {
    expand: {},
  },
  [SPECIALIZATIONS_TABLE]: {},
};

function tableReducer(state = tableInitialState, action) {
  const { tableName } = action;
  const tableState = state[tableName];
  switch (action.type) {
    case TOGGLE_ROW:
      return {
        ...state,
        [tableName]: {
          ...tableState,
          expand: {
            ...tableState.expand,
            [action.payload.name]: !tableState.expand[action.payload.name],
          },
        },
      };
    default:
      return {
        ...state,
      };
  }
}

export { tableInitialState, tableReducer };
