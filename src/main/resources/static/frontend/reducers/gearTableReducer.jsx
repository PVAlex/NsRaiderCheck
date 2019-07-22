import ACTIONS from "../actions/gearTableActions";
import { cloneDeep, orderBy } from "lodash";
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const emptyData = {
        columns: [],
        rows: []
    },
    defaultState = {
        data: emptyData,
        loading: true,
        error: null,
        loadingRow: null,
        columnToSort: null,
        sortDirection: 'desc'
    };

const gearReducer = (state = defaultState, action) => {
    switch (action.type) {
        case ACTIONS.Types.FETCH_GEAR_BEGIN: {
            return {
                ...state,
                data: action.payload.emptyData,
                loading: true,
                error: null
            };
        }

        case ACTIONS.Types.FETCH_GEAR_SUCCESS: {
            const data = state.columnToSort
                ? {
                    rows: orderBy(action.payload.data.rows, state.columnToSort, state.sortDirection),
                    columns: action.payload.data.columns
                }
                : action.payload.data;
            return {
                ...state,
                loading: false,
                data: data
            };
        }

        case ACTIONS.Types.FETCH_GEAR_ERROR: {
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                data: emptyData
            }
        }

        case ACTIONS.Types.REFRESH_CHARACTER_BEGIN: {
            return {
                ...state,
                loadingRow: action.payload.index,
            }
        }

        case ACTIONS.Types.REFRESH_CHARACTER_SUCCESS: {
            let index = state.loadingRow;
            state.data.rows[index] = action.payload.rows[0];
            return {
                ...state,
                loadingRow: null,
            }
        }

        case ACTIONS.Types.REFRESH_CHARACTER_ERROR: {
            return {
                ...state,
                loadingRow: null,
                error: action.payload.error,
            }
        }

        case ACTIONS.Types.SORT_COLUMN: {
            return {
                ...state,
                data: action.payload.data,
                columnToSort: action.payload.columnToSort,
                sortDirection: action.payload.sortDirection
            }
        }

        default:
            return state;
    }
};

const persistConfig = {
    key: 'gearTable',
    storage: storage,
    whitelist: ['columnToSort', 'sortDirection'],
};

export default persistReducer(persistConfig, gearReducer);