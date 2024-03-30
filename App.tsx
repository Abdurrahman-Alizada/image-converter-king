import 'react-native-gesture-handler';
import React, {useCallback, useMemo} from 'react';
import {SafeAreaView} from 'react-native';
import MainNavigation from './src/Main';

import {
  Provider as PaperProvider,
  MD3DarkTheme as PaperDarkTheme,
  MD3LightTheme as PaperDefaultTheme,
} from 'react-native-paper';
import {lightPalette, darkPalette} from './src/GlobalStyles';

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {ThemeContext} from './src/themeContext';

function App(): React.JSX.Element {
  const [isThemeDark, setIsThemeDark] = React.useState(false);
  const CombinedDarkTheme = {
    ...PaperDarkTheme,
    ...NavigationDarkTheme,
    colors: {
      ...PaperDarkTheme?.colors,
      ...NavigationDarkTheme.colors,
      ...darkPalette,
    },
  };

  const CombinedDefaultTheme = {
    ...PaperDefaultTheme,
    ...NavigationDefaultTheme,
    colors: {
      ...PaperDefaultTheme?.colors,
      ...NavigationDefaultTheme.colors,
      ...lightPalette,
    },
  };

  let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

  const toggleTheme = useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ThemeContext.Provider value={preferences}>
        <PaperProvider theme={theme}>
          <MainNavigation />
        </PaperProvider>
      </ThemeContext.Provider>
    </SafeAreaView>
  );
}
export default App;
