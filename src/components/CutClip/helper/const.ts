import { Dimensions } from "react-native";

export const paddingHorizontal = 20;
export const windowWidth = Dimensions.get('window').width - paddingHorizontal * 2;
export const THUMB_WIDTH = 15;
export const THUMB_HEIGHT = 51;
export const PLAYBACK_WIDTH = 5;
export const availableSpace = windowWidth - THUMB_WIDTH * 2;