import { combineReducers } from "redux";
import gearTable from './gearTableReducer';
import navigator from './navigatorReducer';
import { connectRouter } from 'connected-react-router';
import {createBrowserHistory} from "history";
// import { persistCombineReducers } from 'redux-persist'
// import storage from "redux-persist/es/storage";
// import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

//TODO 1 storage
//onst persistConfig = {
//   key: 'root',
//   storage: storage,
//   blacklist: ['router'],
//   stateReconciler: autoMergeLevel2
//;

const history = createBrowserHistory();

const rootReducer = {
    router: connectRouter(history),
    gearTable,
    navigator
};

export default combineReducers(rootReducer)
export { history }