import { type SheriffConfig, anyTag } from '@softarc/sheriff-core';

export const config: SheriffConfig = {
  entryFile: 'src/main.tsx',
  enableBarrelLess: true,
  modules: {
    src: {
      app: 'type:app',
      routes: 'type:routes',
      'core/<area>': ['type:core', 'core:<area>'],
      'shared/<area>': 'type:shared',
      'features/<feature>': 'type:feature',
    },
  },
  depRules: {
    root: ['type:app', 'noTag'],
    noTag: anyTag,
    'type:app': ['type:routes', 'type:core', 'type:shared', 'noTag'],
    'type:routes': ['type:feature', 'core:auth', 'core:layout'],
    'type:core': ['type:core', 'type:shared', 'noTag'],
    'core:*': anyTag,
    'type:shared': ['type:shared', 'core:http', 'core:feedback', 'core:i18n', 'noTag'],
    'type:feature': ['type:core', 'type:shared', 'noTag'],
  },
};
