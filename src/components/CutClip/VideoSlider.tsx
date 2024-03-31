import React from 'react';
import Slider from '@react-native-community/slider';
import {styles} from './VideoTrimmer.style';

type VideoSliderProps = {
  currentTime: number;
  duration: number;
  handleSlideComplete: (value: number) => void;
};

const VideoSlider = ({...props}: VideoSliderProps) => {
  return (
    <Slider
      style={styles.slider}
      value={props.currentTime}
      minimumValue={0}
      maximumValue={props.duration}
      onSlidingComplete={props.handleSlideComplete}
      thumbTintColor="white"
      minimumTrackTintColor="white"
      maximumTrackTintColor="white"
    />
  );
};

export default VideoSlider;
