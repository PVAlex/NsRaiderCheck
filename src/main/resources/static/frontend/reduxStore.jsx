import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import reducer from "./reducers/rootReducer";
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerMiddleware } from 'connected-react-router'
import { persistStore } from 'redux-persist'
import { history } from "./reducers/rootReducer";

export const configureStore = (persistedState) => {
    let store = createStore(
            reducer,
            persistedState,
            composeWithDevTools(
                applyMiddleware(
                    routerMiddleware(history),
                    thunk
                )
            )
        ),
        persistor = persistStore(store);
    return { store, persistor }
};

