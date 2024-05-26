import {View, Text} from 'react-native';
import React from 'react';
import ConvertToOtherFormatAppbar from '../../../../components/Appbars/ConvertToOtherFormatAppbar';
import HomeScreen from './HomeScreen';
import {useTheme} from 'react-native-paper';

const MemeGeneratorIndex = () => {
  const theme = useTheme();
  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <ConvertToOtherFormatAppbar title={'Meme generator'} />
      <HomeScreen />
    </View>
  );
};

export default MemeGeneratorIndex;
