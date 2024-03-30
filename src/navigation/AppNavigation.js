import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
import HomeScreen from '../screens/App/HomeScreen/HomeScreenIndex';
import ConvertToPNGIndex from '../screens/App/ConvertToOtherFormat/ConvertToPNG/ConvertToPNGIndex';
import ConvertToJPGIndex from '../screens/App/ConvertToOtherFormat/ConvertToJPG/ConvertToJPGIndex';
import ImageEditor from '../screens/App/ImageEditor/ImageEditorIndex';
import SingleImageSelection from '../screens/App/ImageSelection/SingleImageSelection';
import ConvertToSVGIndex from '../screens/App/ConvertToOtherFormat/ConvertToSVG/ConvertToSVGIndex';
import ConvertToPDF from '../screens/App/ConvertToOtherFormat/ConvertToPDF/ConvertToPDFIndex';

const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}} />
      <Stack.Screen
        name="SingleImageSelection"
        component={SingleImageSelection}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ConvertToPNG"
        component={ConvertToPNGIndex}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ConvertToJPG"
        component={ConvertToJPGIndex}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ConvertToSVG"
        component={ConvertToSVGIndex}
        options={{headerShown: false}}
      />
      <Stack.Screen name="ConvertToPDF" component={ConvertToPDF} options={{headerShown: false}} />
      <Stack.Screen name="ImageEditor" component={ImageEditor} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

export default AppStack;
