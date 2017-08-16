import React from 'react';
import {
  Platform,
} from 'react-native';

import { AdMobBanner } from 'react-native-admob';
import { BannerView, InterstitialAdManager } from 'react-native-fbads';

import tracker from '../utils/tracker';

import { config } from '../config';

export default class AdBanner extends React.Component {
  state = {
    adType: 'FBADS',
  };

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
    if (this.state.adType === 'ADMOB') {
      return (<AdMobBanner
        bannerSize={this.props.bannerSize}
        adUnitID={config.admob[Platform.OS].banner}
        didFailToReceiveAdWithError={(err) => {
          console.log('AdMob Banner Ad Failed', err);
          tracker.logEvent('click-admob-banner-ad-error', { category: 'user-event', component: 'ad-banner' });
        }}
      />);
    }

    return (<BannerView
      placementId={config.fbads[Platform.OS].banner}
      type="standard"
      onClick={() => tracker.logEvent('click-fb-banner-ad-ok', { category: 'user-event', component: 'ad-banner' })}
      onError={(err) => {
        console.log('Facebook Banner Ad Failed', err);
        tracker.logEvent('load-fb-banner-ad-error', { category: 'user-event', component: 'ad-banner' });
        this.setState({ adType: 'ADMOB' });
      }}
    />);
  }
}

AdBanner.defaultProps = {
  withPopUp: false,
  bannerSize: 'smartBannerPortrait',
};

AdBanner.propTypes = {
  withPopUp: React.PropTypes.bool,
  bannerSize: React.PropTypes.string,
};
