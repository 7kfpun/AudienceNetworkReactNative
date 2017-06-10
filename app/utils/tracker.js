import {
  Platform,
} from 'react-native';

import { Answers } from 'react-native-fabric';
import { AppEventsLogger } from 'react-native-fbsdk';
import DeviceInfo from 'react-native-device-info';

if (__DEV__) {
  AppEventsLogger.setFlushBehavior(Platform.OS === 'ios' ? 'explicit-only' : 'EXPLICIT_ONLY');
} else {
  AppEventsLogger.setFlushBehavior(Platform.OS === 'ios' ? 'auto' : 'AUTO');
}

const isTracking = () => !DeviceInfo.getDeviceName().includes('kf') && DeviceInfo.getManufacturer() !== 'Genymotion';

const tracker = {
  logEvent: (event, parameters) => {
    if (isTracking()) {
      Answers.logCustom(event, parameters);
      AppEventsLogger.logEvent(event, parameters);
    }
  },
};

export default tracker;
