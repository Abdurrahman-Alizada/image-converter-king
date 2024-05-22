import React from 'react';
import {View, Text} from 'react-native';
import ConvertToOtherFormatAppbar from '../../../../components/Appbars/ConvertToOtherFormatAppbar';
import {useTheme} from 'react-native-paper';

const ConvertToGIFIndex = ({route, navigation}) => {
  const theme = useTheme();

  return (
    <View style={{flexGrow: 1, backgroundColor: theme.colors.background}}>
      <ConvertToOtherFormatAppbar title={`Convert to GIF`} />
      <Text style={{textAlign:"center",fontSize:18,marginTop:"10%"}}>Convert to GIF is under development</Text>
    </View>
  );
};

export default ConvertToGIFIndex;
