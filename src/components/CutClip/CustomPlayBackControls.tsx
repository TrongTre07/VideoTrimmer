import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {styles} from './VideoTrimmer.style';
import {PlayIcon, PreviousWhite, FullScreen} from '../Image';

type CustomPlayBackControlsProps = {
  handlePlayPause: () => void;
};

const CustomPlayBackControls = ({
  handlePlayPause,
}: CustomPlayBackControlsProps) => {
  return (
    <View style={styles.controls}>
      <TouchableOpacity style={styles.buttonPlay} onPress={handlePlayPause}>
        <PlayIcon />
      </TouchableOpacity>
      <View />

      <View style={styles.timelineBtn}>
        <TouchableOpacity style={styles.button}>
          <PreviousWhite />
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextTimeline}>
          <PreviousWhite />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <FullScreen />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomPlayBackControls;
