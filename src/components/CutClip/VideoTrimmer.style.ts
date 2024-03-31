import {StyleSheet} from 'react-native';
import {
  PLAYBACK_WIDTH,
  THUMB_HEIGHT,
  THUMB_WIDTH,
  windowWidth,
} from './helper/const';

export const styles = StyleSheet.create({
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
    transform: [{scaleX: -1}],
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
    width: THUMB_WIDTH,
    height: 40,
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
