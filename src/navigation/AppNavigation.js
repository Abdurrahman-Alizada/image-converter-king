import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
import HomeScreen from '../screens/App/HomeScreen/HomeScreenIndex';
import ConvertToPNGIndex from '../screens/App/ConvertToOtherFormat/ConvertToPNG/ConvertToPNGIndex';
import ConvertToJPGIndex from '../screens/App/ConvertToOtherFormat/ConvertToJPG/ConvertToJPGIndex';
import ImageEditor from '../screens/App/OtherTools/ImageEditor/ImageEditorIndex';
import SingleImageSelection from '../screens/App/ImageSelection/SingleImageSelection';
import ConvertToSVGIndex from '../screens/App/ConvertToOtherFormat/ConvertToSVG/ConvertToSVGIndex';
import ConvertToPDF from '../screens/App/ConvertToOtherFormat/ConvertToPDF/ConvertToPDFIndex';
import MemeGenerator from '../screens/App/OtherTools/MemeGenerator/MemeGeneratorIndex';
import CompressImageIndex from '../screens/App/OtherTools/CompressImage/CompressImageIndex';
import ConvertToGIFIndex from '../screens/App/ConvertToOtherFormat/ConvertToGIF/ConvertToGIFIndex';
import ConvertToWEBPIndex from '../screens/App/ConvertToOtherFormat/ConvertToWEBP/ConvertToWEBPIndex';

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
      <Stack.Screen name="ConvertToWEBP" component={ConvertToWEBPIndex} options={{headerShown: false}} />
      <Stack.Screen name="ConvertToGIF" component={ConvertToGIFIndex} options={{headerShown: false}} />
      <Stack.Screen name="ImageEditor" component={ImageEditor} options={{headerShown: false}} />
      <Stack.Screen name="MemeGenerator" component={MemeGenerator} options={{headerShown: false}} />
      <Stack.Screen name="CompressImage" component={CompressImageIndex} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

export default AppStack;
