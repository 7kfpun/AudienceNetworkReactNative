import {
  Platform,
} from 'react-native';

import { Answers } from 'react-native-fabric';
import { AppEventsLogger } from 'react-native-fbsdk';
import Analytics from 'analytics-react-native';
import DeviceInfo from 'react-native-device-info';

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

const tracker = {
  identify: (userId, properties) => {
    if (isTracking) {
      analytics.identify({ userId, traits: properties });
    }
  },
  logEvent: (event, properties) => {
    if (isTracking) {
      analytics.track({ userId, event, properties });
      Answers.logCustom(event, properties);
      AppEventsLogger.logEvent(event, properties);
    }
  },
  view: (name, properties) => {
    if (isTracking) {
      analytics.screen({ userId, name, properties });
    }
  },
};

tracker.identify(
  userId,
  {
    manufacturer: DeviceInfo.getManufacturer(),
    brand: DeviceInfo.getBrand(),
    model: DeviceInfo.getModel(),
    deviceid: DeviceInfo.getDeviceId(),
    systemname: DeviceInfo.getSystemName(),
    systemversion: DeviceInfo.getSystemVersion(),
    bundleid: DeviceInfo.getBundleId(),
    buildnumber: DeviceInfo.getBuildNumber(),
    version: DeviceInfo.getVersion(),
    readableversion: DeviceInfo.getReadableVersion(),
    devicename: DeviceInfo.getDeviceName(),
    useragent: DeviceInfo.getUserAgent(),
    devicelocale: DeviceInfo.getDeviceLocale(),
    devicecountry: DeviceInfo.getDeviceCountry(),
    timezone: DeviceInfo.getTimezone(),
    instanceid: DeviceInfo.getInstanceID(),
    isEmulator: DeviceInfo.isEmulator(),
    isTablet: DeviceInfo.isTablet(),
    isEmulator: DeviceInfo.isEmulator(),
  },
);

export default tracker;
