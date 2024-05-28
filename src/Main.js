
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SplashScreen from './screens/SplashScreen/Index';
import Onboarding from './screens/Onboarding/Index';
import MainNavigation from './navigation/MainNavigation';

const Stack = createNativeStackNavigator();

// import {LogBox} from 'react-native';

// LogBox.ignoreLogs(['EventEmitter.removeListener']);
// LogBox.ignoreLogs(['Possible Unhandled']);
// LogBox.ignoreLogs(['This synthetic event is reused for performance reasons.']);

export const Main = () => {


  return (
    <GestureHandlerRootView style={{flex: 1}}>
          <NavigationContainer>
              <Stack.Navigator initialRouteName="SplashScreen">
                <Stack.Screen
                  name="SplashScreen"
                  component={SplashScreen}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="Onboarding"
                  component={Onboarding}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="Main"
                  component={MainNavigation}
                  options={{headerShown: false}}
                />
              </Stack.Navigator>
            </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default Main;
