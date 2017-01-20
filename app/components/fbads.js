import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { withNativeAd } from 'react-native-fbads';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 8,
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
  },
  description: {
    fontSize: 12,
    opacity: 0.8,
  },
});

const FullNativeAd = withNativeAd(({ nativeAd }) => (
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
      {nativeAd.subtitle && (
        <Text style={styles.subtitle}>{nativeAd.subtitle}</Text>
      )}
      {nativeAd.description && (
        <Text style={styles.description}>{nativeAd.description}</Text>
      )}
    </View>
    {/* <TouchableOpacity style={{ position: 'absolute', top: 5, right: 5, backgroundColor: '#E0E0E0' }} onPress={() => this.setState({ isFbAdsHided: true })} >
      <Icon name="close" size={14} color="#424242" />
    </TouchableOpacity> */}
  </View>
));

export default FullNativeAd;
