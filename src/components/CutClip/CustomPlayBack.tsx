import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {encodingVideo} from './encodingVideo';
import {launchImageLibrary} from 'react-native-image-picker';
import {formatDuration} from './formatDuration';
import PlayIcon from '../Image/PlayIcon';
import PreviousWhite from '../Image/PreviousWhite';
import FullScreen from '../Image/FullScreen';
import OutputDurationTimeline from './OutputDurationTimeline';
import VideoDurationTimeline from './VideoDurationTimeline';
import Triangle from '../Image/Triangle';

const windowWidth = Dimensions.get('window').width - 40;
const THUMB_WIDTH = 15;
const THUMB_HEIGHT = 51;
const PLAYBACK_WIDTH = 5;
const availableSpace = windowWidth - THUMB_WIDTH * 2;

const CustomPlayback = () => {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [thumbnails, setThumbnails] = useState([
    'https://fastly.picsum.photos/id/59/500/500.jpg?hmac=gAZmCCjioI6t2RWT5ZHGCJ2RTBgax1ChIvSfJS3ciGc',
    'https://fastly.picsum.photos/id/59/500/500.jpg?hmac=gAZmCCjioI6t2RWT5ZHGCJ2RTBgax1ChIvSfJS3ciGc',
    'https://fastly.picsum.photos/id/59/500/500.jpg?hmac=gAZmCCjioI6t2RWT5ZHGCJ2RTBgax1ChIvSfJS3ciGc',
    'https://fastly.picsum.photos/id/59/500/500.jpg?hmac=gAZmCCjioI6t2RWT5ZHGCJ2RTBgax1ChIvSfJS3ciGc',
    'https://fastly.picsum.photos/id/59/500/500.jpg?hmac=gAZmCCjioI6t2RWT5ZHGCJ2RTBgax1ChIvSfJS3ciGc',
    'https://fastly.picsum.photos/id/59/500/500.jpg?hmac=gAZmCCjioI6t2RWT5ZHGCJ2RTBgax1ChIvSfJS3ciGc',
    'https://fastly.picsum.photos/id/59/500/500.jpg?hmac=gAZmCCjioI6t2RWT5ZHGCJ2RTBgax1ChIvSfJS3ciGc',
    'https://fastly.picsum.photos/id/59/500/500.jpg?hmac=gAZmCCjioI6t2RWT5ZHGCJ2RTBgax1ChIvSfJS3ciGc',
    'https://fastly.picsum.photos/id/59/500/500.jpg?hmac=gAZmCCjioI6t2RWT5ZHGCJ2RTBgax1ChIvSfJS3ciGc',
    'https://fastly.picsum.photos/id/59/500/500.jpg?hmac=gAZmCCjioI6t2RWT5ZHGCJ2RTBgax1ChIvSfJS3ciGc',
    'https://fastly.picsum.photos/id/59/500/500.jpg?hmac=gAZmCCjioI6t2RWT5ZHGCJ2RTBgax1ChIvSfJS3ciGc',
    'https://fastly.picsum.photos/id/59/500/500.jpg?hmac=gAZmCCjioI6t2RWT5ZHGCJ2RTBgax1ChIvSfJS3ciGc',
    'https://fastly.picsum.photos/id/59/500/500.jpg?hmac=gAZmCCjioI6t2RWT5ZHGCJ2RTBgax1ChIvSfJS3ciGc',
    'https://fastly.picsum.photos/id/59/500/500.jpg?hmac=gAZmCCjioI6t2RWT5ZHGCJ2RTBgax1ChIvSfJS3ciGc',
  ]);
  const [videoUri, setVideoUri] = useState(
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  );
  const currentRef = useRef(0);
  const leftThumbX = useSharedValue(0);
  const rightThumbX = useSharedValue(windowWidth - THUMB_WIDTH);
  const playBackX = useSharedValue(0);
  const lastLeftThumb = useSharedValue(0);
  const lastRightThumb = useSharedValue(0);
  const lastProgressPoint = useSharedValue(0);

  const handleLoad = meta => {
    setDuration(meta.duration);
    setEndTime(meta.duration);
    setCurrentTime(0);
    currentRef.current = meta.duration;
  };

  const handleProgress = progress => {
    setCurrentTime(progress.currentTime);
    lastProgressPoint.value = progress.currentTime;
    const x =
      (progress.currentTime *
        (windowWidth - PLAYBACK_WIDTH - THUMB_WIDTH * 2)) /
      duration;
    playBackX.value = x;
    if (progress.currentTime >= duration) {
      setPaused(true);
      setCurrentTime(startTime);
      videoRef.current.seek(startTime);
      playBackX.value = startTime;
    }
  };

  const handleEnd = () => {
    setPaused(true);
    setCurrentTime(0);
    videoRef.current.seek(0);
    playBackX.value = 0;
  };

  const handlePlayPause = () => {
    setPaused(!paused);
  };

  const handleSlideComplete = time => {
    videoRef.current.seek(time);
    const x =
      (time * (windowWidth - PLAYBACK_WIDTH - THUMB_WIDTH * 2)) / duration;
    playBackX.value = x;
  };

  const leftThumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: 0}],
      width: leftThumbX.value + THUMB_WIDTH,
    };
  });

  const rightThumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: rightThumbX.value}],
      width: windowWidth - rightThumbX.value,
    };
  });

  const playBackAnimatedStyle = useAnimatedStyle(() => {
    const spaceBetweenThumbs =
      rightThumbX.value - leftThumbX.value - THUMB_WIDTH;
    return {
      transform: [
        {
          translateX:
            (playBackX.value * spaceBetweenThumbs) / availableSpace +
            THUMB_WIDTH,
        },
      ],
    };
  });

  const seekVideo = time => {
    videoRef.current?.seek(time);

    setCurrentTime(time);
  };

  const thumbRightUpdate = rightThumbX => {
    const endTime =
      ((rightThumbX - THUMB_WIDTH) / availableSpace) * currentRef.current;
    setEndTime(endTime);
    setDuration(endTime - startTime);
    videoRef.current.seek(startTime);
  };

  const thumbLeftUpdate = leftThumbX => {
    const startTime = (leftThumbX / availableSpace) * currentRef.current;
    setStartTime(startTime);
    const endTime =
      ((rightThumbX.value - THUMB_WIDTH) / availableSpace) * currentRef.current;
    setDuration(endTime - startTime);
    videoRef.current.seek(startTime);
  };

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

      const newTime =
        (playBackX.value / (windowWidth - THUMB_WIDTH * 2)) * duration;
      runOnJS(seekVideo)(newTime);
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
      runOnJS(thumbLeftUpdate)(leftThumbX.value);
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
      runOnJS(thumbRightUpdate)(rightThumbX.value);
    });

  const onEnCodingVideo = async () => {
    const newUri = await encodingVideo({
      videoUri,
      startTime: formatDuration(startTime),
      enCodingDuration: formatDuration(endTime - startTime),
    });

    setVideoUri(newUri);
  };

  const onPickVideo = async () => {
    await launchImageLibrary({mediaType: 'video'}, response => {
      if (response?.didCancel) {
        return;
      }
      console.log(response?.assets?.[0]?.uri);
      setVideoUri(response?.assets?.[0]?.uri || '');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20, fontWeight: '600'}}>
        Cut the sample video
      </Text>

      <View>
        <Video
          ref={videoRef}
          source={{uri: videoUri}}
          style={styles.video}
          paused={paused}
          resizeMode="contain"
          onLoad={handleLoad}
          onProgress={handleProgress}
          onEnd={handleEnd}
          rate={4}
        />
        <VideoDurationTimeline />
      </View>

      <Slider
        style={styles.slider}
        value={currentTime}
        minimumValue={0}
        maximumValue={duration}
        onSlidingComplete={handleSlideComplete}
        thumbTintColor="white"
        minimumTrackTintColor="white"
        maximumTrackTintColor="white"
      />
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

      <OutputDurationTimeline
        startTime={formatDuration(startTime)}
        endTime={formatDuration(endTime)}
      />

      <View style={styles.containerPlayback}>
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
          <Animated.View style={[styles.thumbLeft, leftThumbAnimatedStyle]}>
            <Triangle />
          </Animated.View>
        </GestureDetector>

        <GestureDetector gesture={progressPlaybackGesture}>
          <Animated.View style={[styles.currentTime, playBackAnimatedStyle]} />
        </GestureDetector>

        {/* Right thumb */}
        <GestureDetector gesture={onRightThumbGesture}>
          <Animated.View style={[styles.thumbRight, rightThumbAnimatedStyle]}>
            <View style={{transform: [{rotate: '180deg'}]}}>
              <Triangle />
            </View>
          </Animated.View>
        </GestureDetector>
      </View>

      <TouchableOpacity
        onPress={onEnCodingVideo}
        style={{backgroundColor: 'blue'}}>
        <Text style={{marginTop: 30}}>Trim</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: windowWidth,
    paddingVertical: 10,
  },
  timePerTime: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  timelineBtn: {
    flexDirection: 'row',
  },

  durationTimeline: {
    width: windowWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  video: {
    alignSelf: 'stretch',
    height: 300,
    marginTop: 20,
  },
  slider: {},
  button: {
    paddingHorizontal: 10,
  },
  buttonPlay: {
    position: 'absolute',
    left: '50%',
  },
  nextTimeline: {
    paddingHorizontal: 10,
  },

  containerPlayback: {
    width: windowWidth,
    height: 100,
  },
  thumbnailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: THUMB_WIDTH,
  },
  thumbnail: {
    width: THUMB_WIDTH, // Thumbnail width
    height: 40, // Thumbnail height
  },
  thumbLeft: {
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    borderRadius: 20,
    position: 'absolute',
    backgroundColor: 'rgba(3, 177, 239, 0.5)',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 3,
  },
  thumbRight: {
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    borderRadius: 20,
    position: 'absolute',
    backgroundColor: 'rgba(3, 177, 239, 0.5)',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 3,
  },
  currentTime: {
    width: PLAYBACK_WIDTH,
    height: THUMB_HEIGHT,
    position: 'absolute',
    backgroundColor: '#C99839',
    borderRadius: 10,
  },
});

export default CustomPlayback;
