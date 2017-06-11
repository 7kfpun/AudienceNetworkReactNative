import {
  Platform,
} from 'react-native';

import { AppEventsLogger } from 'react-native-fbsdk';

if (__DEV__) {
  AppEventsLogger.setFlushBehavior(Platform.OS === 'ios' ? 'explicit-only' : 'EXPLICIT_ONLY');
} else {
  AppEventsLogger.setFlushBehavior(Platform.OS === 'ios' ? 'auto' : 'AUTO');
}

const tracker = {
  logEvent: (event, parameters) => {
    AppEventsLogger.logEvent(event, parameters);
  },
};

export default tracker;
