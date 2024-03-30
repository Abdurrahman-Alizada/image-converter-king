import React, {useContext} from 'react';
import {Appbar, useTheme} from 'react-native-paper';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {ThemeContext} from '../../themeContext';
import {StatusBar} from 'react-native';

const HomeScreenAppbar = ({title, isElevated = true}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const {isThemeDark} = useContext(ThemeContext);

  return (
    <Appbar.Header
      style={{backgroundColor: theme.colors.background}}
      elevated={isElevated}>
      <StatusBar
        barStyle={isThemeDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <Appbar.Action
        icon="menu"
        color={theme.colors.onBackground}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <Appbar.Content
        title={title}
        titleStyle={{
          color: theme.colors.onBackground,
        }}
      />
    </Appbar.Header>
  );
};

export default HomeScreenAppbar;
