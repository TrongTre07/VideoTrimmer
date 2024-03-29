import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const OutputDurationTimeline = ({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime: string;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.timeDuration}>00:00:00</Text>
      <Text>Output Duration</Text>
      <Text style={styles.timeDuration}>00:00:00</Text>
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
