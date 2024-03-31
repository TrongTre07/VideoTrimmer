import Video, {OnProgressData} from 'react-native-video';
import React from 'react-native';
import {PLAYBACK_WIDTH, THUMB_WIDTH, windowWidth} from './const';

type HandleProgessProps = {
  setCurrentTime: (value: number) => void;
  lastProgressPoint: {value: number};
  playBackX: {value: number};
  setPaused: (value: boolean) => void;
  videoRef: React.RefObject<Video> | null;
  progress: OnProgressData;
  duration: number;
  startTime: number;
};

export const handleProgress = ({
  setCurrentTime,
  lastProgressPoint,
  playBackX,
  setPaused,
  videoRef,
  progress,
  duration,
  startTime,
}: HandleProgessProps) => {
  setCurrentTime(progress.currentTime);
  lastProgressPoint.value = progress.currentTime;
  const x =
    (progress.currentTime * (windowWidth - PLAYBACK_WIDTH - THUMB_WIDTH * 2)) /
    duration;
  playBackX.value = x;
  if (progress.currentTime >= duration) {
    setPaused(true);
    setCurrentTime(startTime);
    videoRef?.current?.seek(startTime);
    playBackX.value = startTime;
  }
};
