import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';

const globalStyle = {
  applyButton: {
    backgroundColor: 'green',
    color: 'white',
  },
};

const NSThemeProvider = ({ children }) => {

  const theme = createMuiTheme(globalStyle);

  return (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  );
};

NSThemeProvider.propTypes = {
  children: PropTypes.element,
};

NSThemeProvider.defaultProps = {
  children: null,
};

export default NSThemeProvider;
