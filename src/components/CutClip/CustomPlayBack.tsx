import React, {useState, useRef} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import Video, {OnLoadData, OnProgressData} from 'react-native-video';
import Slider from '@react-native-community/slider';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {runOnJS, useSharedValue} from 'react-native-reanimated';
import {encodingVideo} from './helper/encodingVideo';
import {launchImageLibrary} from 'react-native-image-picker';

import OutputDurationTimeline from './OutputDurationTimeline';
import VideoDurationTimeline from './VideoDurationTimeline';
import {
  PLAYBACK_WIDTH,
  THUMB_WIDTH,
  availableSpace,
  windowWidth,
} from './helper/const';
import {styles} from './VideoTrimmer.style';
import VideoSlider from './VideoSlider';
import {formatDuration} from './helper/convertTimeString';
import {
  leftThumbAnimatedStyle,
  playBackAnimatedStyle,
  rightThumbAnimatedStyle,
} from './helper/ThumbAnimatedStyle';
import CustomPlayBackControls from './CustomPlayBackControls';
import {Triangle} from '../Image';
import Thumbnails from './Thumbnails';

const CustomPlayback = () => {
  const videoRef = useRef<Video>(null);
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

  const handleLoad = (meta: OnLoadData) => {
    setDuration(meta.duration);
    setEndTime(meta.duration);
    setCurrentTime(0);
    currentRef.current = meta.duration;
  };

  const handleProgress = (progress: OnProgressData) => {
    setCurrentTime(progress.currentTime);
    lastProgressPoint.value = progress.currentTime;
    const x =
      (progress.currentTime *
        (windowWidth - PLAYBACK_WIDTH - THUMB_WIDTH * 2)) /
      duration;
    playBackX.value = x;
    if (progress.currentTime >= endTime) {
      setPaused(true);
      setCurrentTime(startTime);
      videoRef?.current?.seek(startTime);
      playBackX.value = (startTime * availableSpace) / currentRef.current;
    }
  };

  const handleEnd = () => {
    setPaused(true);
    setCurrentTime(startTime);
    videoRef?.current?.seek(startTime);
    playBackX.value = (startTime * availableSpace) / currentRef.current;
  };

  const handlePlayPause = () => {
    setPaused(!paused);
  };

  const handleSlideComplete = (time: number) => {
    videoRef?.current?.seek(time);
    const x =
      (time * (windowWidth - PLAYBACK_WIDTH - THUMB_WIDTH * 2)) / duration;
    playBackX.value = x;
  };

  const seekVideo = (time: number) => {
    videoRef.current?.seek(time);
    setCurrentTime(time);
  };

  const thumbRightUpdate = (rightThumbX: number) => {
    const endTime =
      ((rightThumbX - THUMB_WIDTH) / availableSpace) * currentRef.current;
    // setEndTime(endTime);
    // setDuration(endTime - startTime);
    setEndTime(endTime);
    if (playBackX.value > rightThumbX) {
      playBackX.value = leftThumbX.value;
    }
  };

  const thumbLeftUpdate = (leftThumbX: number) => {
    const startTime = (leftThumbX / availableSpace) * currentRef.current;
    setStartTime(startTime);
    if (playBackX.value < leftThumbX) {
      playBackX.value = leftThumbX;
      seekVideo(startTime);
    }
    // const endTime =
    //   ((rightThumbX.value - THUMB_WIDTH) / availableSpace) * currentRef.current;
    // setDuration(endTime - startTime);
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

      {/* <TouchableOpacity onPress={onPickVideo}>
        <Text style={{color: 'white'}}>Pick video</Text>
      </TouchableOpacity> */}

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
        <VideoDurationTimeline currentTime={currentTime} duration={duration} />
      </View>

      <VideoSlider
        currentTime={currentTime}
        duration={duration}
        handleSlideComplete={handleSlideComplete}
      />

      <CustomPlayBackControls handlePlayPause={handlePlayPause} />

      <OutputDurationTimeline
        startTime={formatDuration(startTime)}
        endTime={formatDuration(endTime)}
      />

      <View style={styles.containerPlayback}>
        {/* Thumbnails */}
        <Thumbnails thumbnails={thumbnails} />

        {/* Left thumb */}
        <GestureDetector gesture={onLeftThumbGesture}>
          <Animated.View
            style={[styles.thumbLeft, leftThumbAnimatedStyle(leftThumbX)]}>
            <Triangle />
          </Animated.View>
        </GestureDetector>

        <GestureDetector gesture={progressPlaybackGesture}>
          <Animated.View
            style={[styles.currentTime, playBackAnimatedStyle(playBackX)]}
          />
        </GestureDetector>

        {/* Right thumb */}
        <GestureDetector gesture={onRightThumbGesture}>
          <Animated.View
            style={[styles.thumbRight, rightThumbAnimatedStyle(rightThumbX)]}>
            <View style={{transform: [{rotate: '180deg'}]}}>
              <Triangle />
            </View>
          </Animated.View>
        </GestureDetector>
      </View>

      <TouchableOpacity
        onPress={onEnCodingVideo}
        style={{
          backgroundColor: 'white',
          borderRadius: 10,
          width: '50%',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{paddingVertical: 15, color: 'black'}}>Trim</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomPlayback;
