import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { withNativeAd } from 'react-native-fbads';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    marginHorizontal: 8,
    marginBottom: Platform.OS === 'ios' ? 0 : 5,
    justifyContent: 'center',
    borderRightWidth: StyleSheet.hairlineWidth * 2,
    borderRightColor: '#CCCCCC',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: '#CCCCCC',
    backgroundColor: 'white',
  },
  iconAction: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 5,
    marginTop: 5,
  },
  action: {
    color: 'white',
  },
  textBlock: {
    flex: 1,
    padding: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  subtitle: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 28,
  },
  description: {
    fontSize: 12,
    opacity: 0.8,
  },
  adChoices: {
    width: 14,
    height: 14,
  },
});

const FbNativeAd = withNativeAd(({ nativeAd }) => (
  <View style={styles.container}>
    {nativeAd.icon && (
      <View style={styles.iconAction}>
        {nativeAd.icon && <Image style={styles.icon} source={{ uri: nativeAd.icon }} />}
        <View style={styles.button}>
          <Text style={styles.action}>{nativeAd.callToActionText}</Text>
        </View>
      </View>
    )}
    <View style={styles.textBlock}>
      <Text style={styles.title}>{nativeAd.title}</Text>
      <Text style={styles.description}>{'Sponsored Ad'}</Text>
      {nativeAd.subtitle && (
        <Text style={styles.subtitle}>{nativeAd.subtitle}</Text>
      )}
      {nativeAd.description && (
        <Text style={styles.description}>{nativeAd.description}</Text>
      )}
    </View>
    <Image source={require('./../../assets/AdChoices.png')} style={styles.adChoices} />
    {/* <TouchableOpacity style={{ position: 'absolute', top: 5, right: 5, backgroundColor: '#E0E0E0' }} onPress={() => this.setState({ isFbAdsHided: true })} >
      <Icon name="close" size={14} color="#424242" />
    </TouchableOpacity> */}
  </View>
));

export default FbNativeAd;
