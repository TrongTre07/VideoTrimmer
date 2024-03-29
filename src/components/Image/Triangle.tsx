import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Path, Svg} from 'react-native-svg';

const Triangle = () => {
  return (
    <Svg width="6" height="10" viewBox="0 0 6 10" fill="none">
      <Path d="M0.374756 10V0L5.10715 5L0.374756 10Z" fill="white" />
    </Svg>
  );
};

export default Triangle;

const styles = StyleSheet.create({});
