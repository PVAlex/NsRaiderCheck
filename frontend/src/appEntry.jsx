import { ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDom from 'react-dom';
import { App } from '@ns/containers';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { client } from '@ns/apollo';
import { GlobalCss, NSThemeProvider } from '@ns/support';
import { store } from '@ns/redux';

// TODO add root div
ReactDom.render(
  <Router basename="/app">
    <Provider store={store}>
      <ApolloProvider client={client}>
        <GlobalCss />
        <NSThemeProvider>
          <App />
        </NSThemeProvider>
      </ApolloProvider>
    </Provider>
  </Router>,
  document.getElementById('root'),
);

// useEffect(() => {
//     const script = document.createElement('script');

//     script.src = 'http://wow.zamimg.com/widgets/power.js';
//     script.async = true;
//     script.body = 'var whTooltips = {colorLinks: true, iconizeLinks: true, renameLinks: true}';

//     document.body.appendChild(script);
//     return () => {
//         document.body.removeChild(script);
//     }
// }, []);
