import {Image, View} from 'react-native';
import React from 'react';
import {styles} from './VideoTrimmer.style';

type ThumbnailsProps = {
  thumbnails: string[];
};

const Thumbnails = ({thumbnails}: ThumbnailsProps) => {
  return (
    <View style={styles.thumbnailsContainer}>
      {thumbnails.map((thumbnail, index) => (
        <Image key={index} source={{uri: thumbnail}} style={styles.thumbnail} />
      ))}
    </View>
  );
};

export default Thumbnails;
