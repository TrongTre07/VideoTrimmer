import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {formatTimePerTime} from './helper/convertTimeString';

type VideoDurationTimelineProps = {
  currentTime: number;
  duration: number;
};

const VideoDurationTimeline = ({
  currentTime,
  duration,
}: VideoDurationTimelineProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.timePerTime}>
        <Text style={styles.leftDuration}>
          {formatTimePerTime(currentTime)}
        </Text>
        <Text style={styles.rightDuration}>
          {' '}
          / {formatTimePerTime(duration)}
        </Text>
      </View>
      <View style={[styles.timePerTime, {paddingBottom: 20}]}>
        <Text style={styles.leftDuration}>
          {formatTimePerTime(currentTime)}
        </Text>
        <Text style={styles.rightDuration}>
          {' '}
          / {formatTimePerTime(duration)}
        </Text>
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
  rightDuration: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  leftDuration: {
    fontSize: 16,
    fontWeight: '500',
  },
});
