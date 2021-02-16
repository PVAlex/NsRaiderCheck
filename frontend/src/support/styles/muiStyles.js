import { withStyles } from '@material-ui/core';

// eslint-disable-next-line import/prefer-default-export
export const GlobalCss = withStyles({
  '@global': {
    'html, body': {
      margin: 0,
      padding: 0,
      height: '100%',
      overflow: 'hidden',
    },
    '#root': {
      height: '100%',
    },
  },
})(() => null);
