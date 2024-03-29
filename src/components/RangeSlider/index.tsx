import React from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const THUMB_WIDTH = 10;

const RangeSlider = ({duration}: {duration: number}) => {
  const containerWidth = useSharedValue(0);
  const containerLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    console.log('width', width);
    containerWidth.value = width;
  };

  const leftThumb = useSharedValue(0);
  const lastLeftThumb = useSharedValue(0);
  const rightThumb = useSharedValue(0);
  const lastRightThumb = useSharedValue(0);

  const calTime = () => {
    console.log(leftThumb.value, rightThumb.value, containerWidth.value);
    const t1 =
      (leftThumb.value * (duration - THUMB_WIDTH * 2)) / containerWidth.value;
    const t2 =
      Math.abs(rightThumb.value * (duration - THUMB_WIDTH * 2)) /
      containerWidth.value;
  };

  const leftThumbGesture = Gesture.Pan()
    .onBegin(() => {
      lastLeftThumb.value = leftThumb.value;
    })
    .onUpdate(e => {
      let newValue = e.translationX + lastLeftThumb.value;

      const maxValue =
        containerWidth.value - Math.abs(rightThumb.value) - THUMB_WIDTH * 2;

      if (newValue > maxValue) {
        newValue = maxValue;
      } else if (newValue < 0) {
        newValue = 0;
      } else if (newValue > containerWidth.value) {
        newValue = containerWidth.value - THUMB_WIDTH / 2;
      }
      leftThumb.value = newValue;

      calTime();
    })
    .onEnd(() => {})
    .onFinalize(() => {})
    .runOnJS(true);

  const rightThumbGesture = Gesture.Pan()
    .onBegin(() => {
      lastRightThumb.value = rightThumb.value;
    })
    .onUpdate(e => {
      let newValue = e.translationX + lastRightThumb.value;
      const minValue =
        containerWidth.value - Math.abs(leftThumb.value) - THUMB_WIDTH * 2;
      if (newValue < -minValue) {
        newValue = -minValue;
      } else if (newValue > 0) {
        newValue = 0;
      } else if (newValue <= -containerWidth.value) {
        newValue = -containerWidth.value + THUMB_WIDTH * 2;
      }
      rightThumb.value = newValue;

      calTime();
    })
    .onEnd(() => {})
    .onFinalize(() => {})
    .runOnJS(true);

  const leftThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: leftThumb.value,
        },
      ],
    };
  });

  const rightThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: rightThumb.value,
        },
      ],
    };
  });

  const leftUnselectedRail = useAnimatedStyle(() => {
    return {
      width: leftThumb.value,
      borderRightWidth: 0,
    };
  });

  const rightUnselectedRail = useAnimatedStyle(() => {
    return {
      width: -rightThumb.value,
      borderLeftWidth: 0,
    };
  });

  return (
    <>
      <View style={styles.container} onLayout={containerLayout}>
        <View style={{flexDirection: 'row'}}>
          <Animated.View style={[styles.unselectedRail, leftUnselectedRail]} />
          <GestureDetector gesture={leftThumbGesture}>
            <Animated.View style={[styles.thumb, leftThumbStyle]} />
          </GestureDetector>
        </View>
        <View style={{flexDirection: 'row-reverse'}}>
          <GestureDetector gesture={rightThumbGesture}>
            <Animated.View style={[styles.thumb, rightThumbStyle]} />
          </GestureDetector>
          <Animated.View style={[styles.unselectedRail, rightUnselectedRail]} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',

    marginTop: 10,
    backgroundColor: 'black',
    marginHorizontal: 10,
  },

  thumb: {
    width: THUMB_WIDTH,
    height: 40,
    backgroundColor: 'orange',
    position: 'absolute',
  },

  unselectedRail: {
    backgroundColor: 'grey',
    height: 40,
    position: 'absolute',
    // opacity: 0.4,
    borderColor: 'orange',
    borderWidth: 1,
  },
});

export default RangeSlider;
