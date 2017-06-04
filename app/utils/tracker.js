import { AppEventsLogger } from 'react-native-fbsdk';

if (__DEV__) {
  AppEventsLogger.setFlushBehavior('explicit-only');
} else {
  AppEventsLogger.setFlushBehavior('auto');
}

const tracker = {
  logEvent: (event, parameters) => {
    AppEventsLogger.logEvent(event, parameters);
  },
};

export default tracker;
