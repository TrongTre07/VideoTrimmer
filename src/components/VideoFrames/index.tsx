import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {FFmpegKit, FFmpegKitConfig} from 'ffmpeg-kit-react-native';
import * as RNFS from 'react-native-fs';

export const VideoFrames = () => {
  const [inputVideoPath, setInputVideoPath] = useState(
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  );
  const [framesPath, setFramesPath] = useState('');

  const imageFilePrefix = 'video-frame-img-';
  const imageFileExtension = 'jpeg';
  const totalDecimalZeroes = 7;

  useEffect(() => {
    console.log('RNFS.CachesDirectoryPath', RNFS.CachesDirectoryPath);
    if (inputVideoPath) {
      const inputVideoPathArr = inputVideoPath?.split('/');
      inputVideoPathArr?.pop();

      // if (!framesPath) {
      //   FFmpegKit?.executeAsync(
      //     `-y -i ${inputVideoPath} -r 30 ${RNFS.CachesDirectoryPath}/${imageFilePrefix}%0${totalDecimalZeroes}d.${imageFileExtension}`,
      //     () => {},
      //   );
      // }
    }
  }, [inputVideoPath]);

  return <View></View>;
};
