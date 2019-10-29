import React from "react";
import MainLayout from "./components/MainLayout";
import { Provider } from 'react-redux';
import { configureStore } from "./reduxStore";
import { PersistGate } from 'redux-persist/integration/react'


class App extends React.Component {

    render() {
        const {persistor, store} = configureStore();

        return (
            <Provider store={store}>
                <PersistGate loading={<span>Loading</span>} persistor={persistor}>
                    <MainLayout/>
                </PersistGate>
            </Provider>
        );
    }
}

export default App