import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const VideoDurationTimeline = () => {
  return (
    <View style={styles.container}>
      <View style={styles.timePerTime}>
        <Text>00:12</Text>
        <Text> / 00:12</Text>
      </View>
      <View style={[styles.timePerTime, {paddingBottom: 20}]}>
        <Text>00:12</Text>
        <Text> / 00:12</Text>
      </View>
    </View>
  );
};

export default VideoDurationTimeline;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
  },
  timePerTime: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
});
