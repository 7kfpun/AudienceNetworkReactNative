import React from 'react';
import {
  Platform,
} from 'react-native';

import { AppEventsLogger } from 'react-native-fbsdk';
import { BannerView, InterstitialAdManager } from 'react-native-fbads';

import { config } from '../config';

export default class AdBanner extends React.Component {
  componentDidMount() {
    if (this.props.withPopUp) {
      InterstitialAdManager.showAd(config.fbads[Platform.OS].interstitial)
        .then((didClick) => {
          console.log('Facebook Interstitial Ad', didClick);
          if (didClick) {
            AppEventsLogger.logEvent('click-fb-interstitial-ad-ok');
          } else {
            AppEventsLogger.logEvent('click-fb-interstitial-ad-cancel');
          }
        })
        .catch((error) => {
          console.log('Facebook Interstitial Ad Failed', error);
          AppEventsLogger.logEvent('load-fb-interstitial-ad-failed');
        });
    }
  }

  render() {
    return (<BannerView
      placementId={config.fbads[Platform.OS].banner}
      type="standard"
      onClick={() => AppEventsLogger.logEvent('click-fb-banner-ad-ok')}
      onError={() => AppEventsLogger.logEvent('load-fb-banner-ad-failed')}
    />);
  }
}

AdBanner.defaultProps = {
  withPopUp: false,
};

AdBanner.propTypes = {
  withPopUp: React.PropTypes.bool,
};
