import React from 'react';
import {
  Platform,
} from 'react-native';

import { BannerView, InterstitialAdManager } from 'react-native-fbads';

import tracker from '../utils/tracker';

import { config } from '../config';

export default class AdBanner extends React.Component {
  componentDidMount() {
    if (this.props.withPopUp) {
      InterstitialAdManager.showAd(config.fbads[Platform.OS].interstitial)
        .then((didClick) => {
          console.log('Facebook Interstitial Ad', didClick);
          if (didClick) {
            tracker.logEvent('click-fb-interstitial-ad-ok', { category: 'user-event', component: 'ad-interstitial' });
          } else {
            tracker.logEvent('click-fb-interstitial-ad-cancel', { category: 'user-event', component: 'ad-interstitial' });
          }
        })
        .catch((error) => {
          console.log('Facebook Interstitial Ad Failed', error);
          tracker.logEvent('load-fb-interstitial-ad-error', { category: 'user-event', component: 'ad-interstitial' });
        });
    }
  }

  render() {
    return (<BannerView
      placementId={config.fbads[Platform.OS].banner}
      type="standard"
      onClick={() => tracker.logEvent('click-fb-banner-ad-ok', { category: 'user-event', component: 'ad-banner' })}
      onError={() => tracker.logEvent('click-fb-banner-ad-error', { category: 'user-event', component: 'ad-banner' })}
    />);
  }
}

AdBanner.defaultProps = {
  withPopUp: false,
};

AdBanner.propTypes = {
  withPopUp: React.PropTypes.bool,
};
