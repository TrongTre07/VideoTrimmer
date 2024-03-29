/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {CutClip} from './src/components/CutClip';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import VideoPicker from './src/components/CutClip/VideoPicker';
import CustomPlayback from './src/components/CutClip/CustomPlayBack';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: 'gray',
    flex: 1,
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={backgroundStyle}>
        <CustomPlayback />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default App;
