import { getFilter, saveFilter } from '@ns/support';
import {
  BIS_LIST_TABLE, COVENANT_TABLE, GEAR_TABLE, PROFESSIONS_TABLE,
  REPUTATIONS_TABLE, RIO_TABLE, SPECIALIZATIONS_TABLE, PROFILE_TABLE,
} from '@ns/components/Table/tableName';
import { SAVE_FILTER } from '../types';

const rankSort = [0, 1, 2, 3, 4, 8];

const filterInitialState = {
  [BIS_LIST_TABLE]: { rankSort, ...getFilter(BIS_LIST_TABLE) },
  [COVENANT_TABLE]: { rankSort, ...getFilter(COVENANT_TABLE) },
  [GEAR_TABLE]: { rankSort, hasFail: false, ...getFilter(GEAR_TABLE) },
  [PROFILE_TABLE]: { rankSort, ...getFilter(PROFILE_TABLE) },
  [REPUTATIONS_TABLE]: { rankSort, ...getFilter(REPUTATIONS_TABLE) },
  [RIO_TABLE]: { rankSort, ...getFilter(RIO_TABLE) },
  [SPECIALIZATIONS_TABLE]: { rankSort, ...getFilter(SPECIALIZATIONS_TABLE) },
  [PROFESSIONS_TABLE]: { rankSort, ...getFilter(PROFESSIONS_TABLE) },
};

function filterReducer(state = filterInitialState, action) {
  const { tableName } = action;
  switch (action.type) {
    case SAVE_FILTER:
      saveFilter(tableName, action.payload.filter);
      return {
        ...state,
        [tableName]: {
          ...action.payload.filter,
        },
      };
    default:
      return {
        ...state,
      };
  }
}

export { filterInitialState, filterReducer };
