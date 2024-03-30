// Import React and Component
import React, {useLayoutEffect, useEffect, useRef, useState} from 'react';
import {View, ActivityIndicator, Image, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {version} from '../../../package.json';

const SplashScreen = ({navigation}) => {

  const isAppFirstLaunched = useRef(true); //onboarding screen decision
  useEffect(() => {
    const firstLaunch = async () => {
      const appData = await AsyncStorage.getItem('isAppFirstLaunched1').then(
        value => value,
      );

      if (appData) {
        isAppFirstLaunched.current = false;
      } else {
        isAppFirstLaunched.current = true;
        await AsyncStorage.setItem('isAppFirstLaunched1', '1');
      }
    };
    firstLaunch();
  }, []);

  useEffect(() => {
          setTimeout(() => {
            isAppFirstLaunched?.current
              ? navigation.replace('Onboarding')
              : navigation.replace('Main');
          }, 2000);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          flex: 0.95,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          style={{
            width: 150,
            height: 150,
          }}
          source={require('../../assets/onboarding/1.png')}
        />
        <ActivityIndicator />
      </View>
      <Text style={{fontWeight: 'bold'}}>
        V {version}
      </Text>
    </View>
  );
};

export default SplashScreen;
