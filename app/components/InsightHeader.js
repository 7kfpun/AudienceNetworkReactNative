import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  cell: {
    flex: 1,
    alignItems: 'flex-end',
    borderLeftColor: '#EEEEEE',
    borderLeftWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 6,
    paddingVertical: 15,
  },
  text: {
    fontSize: 15,
    lineHeight: 24,
  },
});

const InsightHeader = () => (
  <View style={styles.container}>
    <View style={[styles.cell, { flex: 1.5 }]} />
    <View style={styles.cell}><Text style={styles.text}>{'Requests'}</Text></View>
    <View style={styles.cell}><Text style={styles.text}>{'Filled'}</Text></View>
    <View style={styles.cell}><Text style={styles.text}>{'Impressions'}</Text></View>
    <View style={styles.cell}><Text style={styles.text}>{'Clicks'}</Text></View>

    <View style={styles.cell}><Text style={styles.text}>{'Fill Rate'}</Text></View>
    <View style={styles.cell}><Text style={styles.text}>{'CTR'}</Text></View>
    <View style={styles.cell}><Text style={styles.text}>{'eCPM'}</Text></View>
    <View style={styles.cell}><Text style={styles.text}>{'Est. Rev'}</Text></View>
  </View>
);


export default InsightHeader;
