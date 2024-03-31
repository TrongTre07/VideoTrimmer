import {SharedValue, useAnimatedStyle} from 'react-native-reanimated';
import {THUMB_WIDTH, windowWidth} from './const';

export const leftThumbAnimatedStyle = (leftThumbX: SharedValue<number>) => {
  return useAnimatedStyle(() => {
    return {
      transform: [{translateX: 0}],
      width: leftThumbX.value + THUMB_WIDTH,
    };
  });
};

export const rightThumbAnimatedStyle = (rightThumbX: SharedValue<number>) => {
  return useAnimatedStyle(() => {
    return {
      transform: [{translateX: rightThumbX.value}],
      width: windowWidth - rightThumbX.value,
    };
  });
};

export const playBackAnimatedStyle = (playBackX: SharedValue<number>) => {
  return useAnimatedStyle(() => {
    return {
      transform: [{translateX: playBackX.value + THUMB_WIDTH}],
    };
  });
};

// const playBackAnimatedStyle = useAnimatedStyle(() => {
//     const spaceBetweenThumbs =
//       rightThumbX.value - leftThumbX.value - THUMB_WIDTH;
//     return {
//       transform: [
//         {
//           translateX: playBackX.value + THUMB_WIDTH,
//         },
//       ],
//     };
//   });
