import { useLayoutEffect } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useWowhead = (enable = true) => {
  useLayoutEffect(() => {
    if (enable) {
      window.whTooltips = {
        iconizelinks: false,
        renamelinks: false,
        iconsize: 'large',
        hide: {
          droppedby: false,
          dropchance: false,
        },
      };
      const script = document.createElement('script');
      script.src = 'http://wow.zamimg.com/widgets/power.js';
      document.head.append(script);
    }
  }, []);
};
