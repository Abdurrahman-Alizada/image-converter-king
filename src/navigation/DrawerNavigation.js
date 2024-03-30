import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
import Myprofile from '../screens/Drawer/MyProfile/ProfileIndex';

const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        name="Profile"
        component={Myprofile}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
