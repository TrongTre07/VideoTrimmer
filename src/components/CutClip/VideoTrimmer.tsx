import React, {useState} from 'react';
import {View, StyleSheet, Dimensions, Image} from 'react-native';
import {
  Gesture,
  GestureDetector,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const windowWidth = Dimensions.get('window').width;
const THUMB_WIDTH = 50;
const PLAYBACK_WIDTH = 15;

const VideoTrimmer = ({thumbnails, currentTime, duration}) => {
  // Shared values for the thumb positions
  const leftThumbX = useSharedValue(0);
  const rightThumbX = useSharedValue(windowWidth - 50); // Assuming thumb is 50px wide
  const playBackX = useSharedValue(0);
  const lastLeftThumb = useSharedValue(0);
  const lastRightThumb = useSharedValue(0);
  const lastProgressPoint = useSharedValue(0);

  // Animated styles for thumbs
  const leftThumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: 0}],
      width: leftThumbX.value + THUMB_WIDTH,
    };
  });

  const rightThumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: rightThumbX.value}],
      width: Math.floor(windowWidth - rightThumbX.value),
    };
  });

  const playBackAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: playBackX.value + THUMB_WIDTH + currentTime,
        },
      ],
    };
  });

  const progressPlaybackGesture = Gesture.Pan()
    .onBegin(() => {
      lastProgressPoint.value = playBackX.value;
    })
    .onUpdate(e => {
      playBackX.value = Math.min(
        Math.max(leftThumbX.value, lastProgressPoint.value + e.translationX),
        rightThumbX.value - THUMB_WIDTH - PLAYBACK_WIDTH,
      );
    })
    .onEnd(() => {
      lastProgressPoint.value = playBackX.value;
    });

  const onLeftThumbGesture = Gesture.Pan()
    .onBegin(() => {
      lastLeftThumb.value = leftThumbX.value;
    })
    .onUpdate(e => {
      leftThumbX.value = Math.min(
        Math.max(0, lastLeftThumb.value + e.translationX),
        rightThumbX.value - THUMB_WIDTH,
      );
    })
    .onEnd(() => {
      lastLeftThumb.value = leftThumbX.value;
    });

  const onRightThumbGesture = Gesture.Pan()
    .onBegin(() => {
      lastRightThumb.value = rightThumbX.value;
    })
    .onUpdate(e => {
      rightThumbX.value = Math.min(
        Math.max(
          leftThumbX.value + THUMB_WIDTH,
          lastRightThumb.value + e.translationX,
        ),
        windowWidth - THUMB_WIDTH,
      );
    })
    .onEnd(() => {
      lastRightThumb.value = rightThumbX.value;
    });

  return (
    <View style={styles.container}>
      {/* Thumbnails */}
      <View style={styles.thumbnailsContainer}>
        {thumbnails.map((thumbnail, index) => (
          <Image
            key={index}
            source={{uri: thumbnail}}
            style={styles.thumbnail}
          />
        ))}
      </View>

      {/* Left thumb */}
      <GestureDetector gesture={onLeftThumbGesture}>
        <Animated.View style={[styles.thumbLeft, leftThumbAnimatedStyle]} />
      </GestureDetector>

      <GestureDetector gesture={progressPlaybackGesture}>
        <Animated.View style={[styles.currentTime, playBackAnimatedStyle]} />
      </GestureDetector>

      {/* Right thumb */}
      <GestureDetector gesture={onRightThumbGesture}>
        <Animated.View style={[styles.thumbRight, rightThumbAnimatedStyle]} />
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: 100, // Adjust the height as needed
  },
  thumbnailsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 50, // Adjust thumbnail container height as needed
  },
  thumbnail: {
    width: 50, // Thumbnail width
    height: 50, // Thumbnail height
  },
  thumbLeft: {
    width: 50,
    height: 100,
    position: 'absolute',
    backgroundColor: 'rgba(221, 221, 255,0.5)', // Use a semi-transparent color
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbRight: {
    width: 50,
    height: 100,
    position: 'absolute',
    backgroundColor: 'rgba(255,221,238,0.5)', // Use a semi-transparent color
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentTime: {
    width: PLAYBACK_WIDTH,
    height: 100,
    position: 'absolute',
    backgroundColor: 'red',
  },
});

export default VideoTrimmer;
