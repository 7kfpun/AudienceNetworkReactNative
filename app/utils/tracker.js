import {
  Dimensions,
  PixelRatio,
  Platform,
} from 'react-native';

import { Answers } from 'react-native-fabric';
import { AppEventsLogger } from 'react-native-fbsdk';
import Analytics from 'analytics-react-native';
import DeviceInfo from 'react-native-device-info';

const { width, height } = Dimensions.get('window');

import { config } from '../config';

const analytics = new Analytics(config.segment);

if (__DEV__) {
  AppEventsLogger.setFlushBehavior(Platform.OS === 'ios' ? 'explicit-only' : 'EXPLICIT_ONLY');
} else {
  AppEventsLogger.setFlushBehavior(Platform.OS === 'ios' ? 'auto' : 'AUTO');
}

const userId = DeviceInfo.getUniqueID();
const isTracking = !(
  DeviceInfo.getDeviceName().includes('kf')
  || DeviceInfo.getManufacturer() === 'Genymotion'
  || DeviceInfo.isEmulator()
);

const context = {
  app: {
    namespace: DeviceInfo.getBundleId(),
    version: DeviceInfo.getBuildNumber(),
    build: DeviceInfo.getReadableVersion(),
  },
  device: {
    id: DeviceInfo.getUniqueID(),
    manufacturer: DeviceInfo.getManufacturer(),
    model: DeviceInfo.getModel(),
    name: DeviceInfo.getDeviceId(),
    type: DeviceInfo.getDeviceName(),
    version: DeviceInfo.getBrand(),
    brand: DeviceInfo.getBrand(),
  },
  locale: DeviceInfo.getDeviceLocale(),
  location: {
    country: DeviceInfo.getDeviceCountry(),
  },
  os: {
    name: DeviceInfo.getSystemName(),
    version: DeviceInfo.getSystemVersion(),
  },
  screen: {
    width,
    height,
    density: PixelRatio.get(),
  },
  timezone: DeviceInfo.getTimezone(),
  userAgent: DeviceInfo.getUserAgent(),

  instanceid: DeviceInfo.getInstanceID(),
  isEmulator: DeviceInfo.isEmulator(),
  isTablet: DeviceInfo.isTablet(),
  isEmulator: DeviceInfo.isEmulator(),
};

const tracker = {
  identify: () => {
    if (isTracking) {
      analytics.identify({ userId, context });
    }
  },
  logEvent: (event, properties) => {
    if (isTracking) {
      analytics.track({ userId, event, properties, context });
      Answers.logCustom(event, properties);
      AppEventsLogger.logEvent(event, properties);
    }
  },
  view: (name, properties) => {
    if (isTracking) {
      analytics.screen({ userId, name, properties, context });
    }
  },
};

fetch('http://checkip.amazonaws.com/')
  .then(res => res.text())
  .then(ip => {
    ip = ip.replace('\n', '');
    if (ip) {
      console.log('ip address', ip);
      context.ip = ip;
    }
    tracker.identify();
  });

export default tracker;
