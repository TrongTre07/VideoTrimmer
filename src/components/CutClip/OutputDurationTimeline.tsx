import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {convertTimeString} from './helper/convertTimeString';

const OutputDurationTimeline = ({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime: string;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.timeDuration}>{convertTimeString(startTime)}</Text>
      <Text>Output Duration</Text>
      <Text style={styles.timeDuration}>{convertTimeString(endTime)}</Text>
    </View>
  );
};

export default OutputDurationTimeline;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeDuration: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  txtOutput: {
    color: 'gray',
    fontSize: 16,
    fontWeight: '500',
  },
});
