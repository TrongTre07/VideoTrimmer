import React, {useRef, useState} from 'react';
import {
  Button,
  Easing,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import Video, {OnLoadData} from 'react-native-video';
import {VideoFrames} from '../VideoFrames';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {launchImageLibrary} from 'react-native-image-picker';

const THUMB_WIDTH = 10;

export const CutClip = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(true);
  const [seek, setSeek] = useState(0);

  const ref = useRef<Video>(null);

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
  const progressPoint = useSharedValue(0);
  const lastProgressPoint = useSharedValue(0);
  const frameDuration = useSharedValue(0);

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

      // calTime();
    })
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

      // calTime();
    })
    .runOnJS(true);

  const progressPointGesture = Gesture.Pan()
    .onBegin(() => {
      lastProgressPoint.value = progressPoint.value;
    })
    .onUpdate(e => {
      let newValue = e.translationX + lastProgressPoint.value;
      const max = containerWidth.value - THUMB_WIDTH * 2;
      if (newValue < 0) {
        newValue = 0;
      }
      if (newValue > max) {
        newValue = max;
      }
      progressPoint.value = newValue;

      // calculate seek value
      const t = (progressPoint.value * duration) / max;
      setSeek(t + 2);
      if (ref) {
        ref.current?.seek(t, 3);
      }
    })
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

  const progressPointStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(progressPoint.value + THUMB_WIDTH, {
            duration: 16,
          }),
        },
      ],
    };
  });

  const handlePlay = () => {
    setPaused(t => !t);
  };

  const handleVideoLoaded = (data: OnLoadData) => {
    console.log('data', data.duration);
    setDuration(data.duration);
  };

  const [videoUri, setVideoUri] = useState<string>(
    'file:///data/user/0/com.cutclip/cache/rn_image_picker_lib_temp_9a19e971-cf2a-4f00-986f-4d8d700aa461.mp4',
  );

  const pickVideo = async () => {
    const result = await launchImageLibrary({mediaType: 'video'}, response => {
      console.log('Response = ', response);
    });
    setVideoUri(result?.assets[0]?.uri);
  };

  return (
    <>
      <View>
        {!videoUri ? (
          <TouchableOpacity onPress={pickVideo}>
            <Text>Open Gallery</Text>
          </TouchableOpacity>
        ) : (
          <Video
            ref={ref}
            source={{
              uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            }}
            style={{width: '100%', height: 200}}
            resizeMode="contain"
            playWhenInactive={false}
            paused={paused}
            seek={4}
            onProgress={data => {
              lastProgressPoint.value = data.currentTime;
              frameDuration.value = data.currentTime - lastProgressPoint.value;
              const x =
                (data.currentTime * (containerWidth.value - THUMB_WIDTH * 2)) /
                duration;
              progressPoint.value = x;
            }}
            controls
            onLoad={handleVideoLoaded}
          />
        )}

        <Button title="play" onPress={handlePlay} />
      </View>

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

        <GestureDetector gesture={progressPointGesture}>
          <Animated.View style={[styles.progressPoint, progressPointStyle]} />
        </GestureDetector>
      </View>

      {/* <VideoFrames /> */}
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

  progressPoint: {
    height: 40,
    width: 20,
    backgroundColor: 'white',
    position: 'absolute',
  },
});
