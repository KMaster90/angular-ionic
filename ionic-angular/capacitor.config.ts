import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.kmaster.angularproject',
  appName: 'ionic-angular',
  webDir: 'www',
  bundledWebRuntime: false,
  cordova:{
    preferences:{
      'android-minSdkVersion': '24',
    }
  }
};

export default config;
