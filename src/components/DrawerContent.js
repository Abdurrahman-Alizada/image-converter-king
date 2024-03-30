import React, {useEffect, useRef, useState} from 'react';
import {View, Linking, Alert, Text} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';

export default function DrawerContent(props) {

  return (
    <DrawerContentScrollView
      {...props}
      style={{}}
      contentContainerStyle={{flex: 1, justifyContent: 'space-between'}}>
        <Text>Hello</Text>
</DrawerContentScrollView>
  );
}
