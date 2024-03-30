import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import DrawerContent from '../components/DrawerContent';
import AppNavigation from './AppNavigation';
import DrawerNavigation from './DrawerNavigation'

const Drawer1 = createDrawerNavigator();

const DrawerStack = props => {
  return (
    <Drawer1.Navigator drawerContent={() => <DrawerContent />}>
      <Drawer1.Screen
        options={{headerShown: false}}
        name="AppNavigation"
        component={AppNavigation}
      />
      <Drawer1.Screen
        options={{headerShown: false}}
        name="DrawerNavigation"
        component={DrawerNavigation}
      />
    </Drawer1.Navigator>
  );
};

export default DrawerStack;
