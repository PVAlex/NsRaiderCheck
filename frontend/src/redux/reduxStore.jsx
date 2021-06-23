import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { filterReducer } from './reducers/filterReducer';
import { tableReducer } from './reducers/tableReducer';

const rootReducer = combineReducers({
  table: tableReducer,
  filter: filterReducer,
});

export default createStore(rootReducer, composeWithDevTools(
  applyMiddleware(thunk),
));
