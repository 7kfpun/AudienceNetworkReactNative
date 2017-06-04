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

const tracker = {
  logEvent: (event, parameters) => {
    if (DeviceInfo.getDeviceName().includes('kf')) {
      Answers.logCustom(event, parameters);
      AppEventsLogger.logEvent(event, parameters);
    }
  },
};

export default tracker;
