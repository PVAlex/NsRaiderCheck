import React from 'react';
import App from './App.jsx';
import ReactDom from 'react-dom';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/select/lib/css/blueprint-select.css';
import '@blueprintjs/table/lib/css/table.css';
import './styles/custom-core.css'

ReactDom.hydrate(
    <App />,
    document.getElementById ('root')
);