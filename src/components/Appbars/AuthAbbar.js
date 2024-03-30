import {Appbar, Text, useTheme, IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Image, StatusBar, View} from 'react-native';
import {useContext, useState} from 'react';
import {ThemeContext} from '../../themeContext';

export default function CustomNavigationBar({title}) {
  const navigation = useNavigation();
  const theme = useTheme();
  const {t} = useTranslation();

  const {toggleTheme, isThemeDark} = useContext(ThemeContext);

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: theme.colors.background,
          justifyContent: 'space-between',
        }}>
        <StatusBar
          barStyle={isThemeDark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        <View style={{alignItems: 'center', width: '33%'}}>
          {title == 'Sign in' || title == 'Reset password' ? (
            <Text></Text>
          ) : (
            <Appbar.BackAction
              style={{alignSelf: 'flex-start'}}
              onPress={() => navigation.goBack()}
            />
          )}
        </View>
        <View style={{width: '33%'}}>
          <Image
            style={{
              width: 100,
              height: 100,
            }}
            source={require('../../assets/splash-screen/carib-coin-logo.png')}
          />
        </View>

        <View style={{flexDirection: 'row',}}>
          {isThemeDark ? (
            <IconButton
              icon="white-balance-sunny"
              titleStyle={{color: theme.colors.onBackground}}
              onPress={() => toggleTheme()}
            />
          ) : (
            <IconButton
              icon="weather-night"
              onPress={() => toggleTheme()}
            />
          )}
          <IconButton
            icon="translate"
            style={{marginRight:"2%"}}
            onPress={() => {
              navigation.navigate('Main', {
                screen: 'BottomTabStack',
                params: {
                  screen: 'ChooseLanguage',
                },
              });
            }}
          />
        </View>
      </View>
      <Text
        style={{
          fontSize: 22,
          marginTop: '5%',
          textAlign: 'center',
        }}>
        {t(title)}
      </Text>
    </View>
  );
}
