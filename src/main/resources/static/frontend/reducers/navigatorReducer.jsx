import ACTIONS from "../actions/navigatorActions";
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';


const defaultState = {
        darkTheme: false
    };

const navigatorReducer = (state = defaultState, action) => {
    switch (action.type) {
        case ACTIONS.Types.SWITCH_THEME: {
            return {
                ...state,
                darkTheme: !state.darkTheme,
            };
        }

        default:
            return state;
    }
};

const persistConfig = {
    key: 'navigator',
    storage: storage,
    whitelist: ['darkTheme'],
};

export default persistReducer( persistConfig, navigatorReducer);