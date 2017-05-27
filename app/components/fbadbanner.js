import React from 'react';
import {
  Platform,
} from 'react-native';

import { BannerView, InterstitialAdManager } from 'react-native-fbads';

import { config } from '../config';

export default class AdBanner extends React.Component {
  componentDidMount() {
    InterstitialAdManager.showAd(config.fbads[Platform.OS].interstitial)
      .then((didClick) => {
        console.log('Facebook Interstitial Ad', didClick);
      })
      .catch((error) => {
        console.log('Facebook Interstitial Ad Failed', error);
      });
  }

  render() {
    return (<BannerView
      placementId={config.fbads[Platform.OS].banner}
      type="standard"
      onClick={() => console.log('click')}
      onError={() => this.setState({ adType: 'ADMOB' })}
    />);
  }
}
