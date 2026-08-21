import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.woniu.coupleflyingchess',
  appName: '情侣飞行棋',
  webDir: 'dist',
  android: {
    allowMixedContent: true
  }
};

export default config;