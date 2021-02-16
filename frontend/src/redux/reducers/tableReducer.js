import { TOGGLE_ROW } from '../types';

const tableInitialState = {
  rioTable: {
    expand: {},
  },
  gearTable: {},
  specializationTable: {},
  profileTable: {},
  bisListTable: {},
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
