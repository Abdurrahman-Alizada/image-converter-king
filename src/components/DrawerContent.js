import React, {useEffect} from 'react';
import {Alert, Linking, Platform, View} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {Drawer, useTheme, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

import {version} from '../../package.json';

const GOOGLE_PACKAGE_NAME = 'com.softcodes.eventplanner';
const APPLE_STORE_ID = 'id284882215';


export default function DrawerContent(props) {
  const navigation = useNavigation();
  const theme = useTheme();

  const openStore = () => {
    if (Platform.OS != 'ios') {
      Linking.openURL(`market://details?id=${GOOGLE_PACKAGE_NAME}`).catch(err =>
        Alert.alert('Please check for Google Play Store'),
      );
    } else {
      Linking.openURL(`itms://itunes.apple.com/in/app/apple-store/${APPLE_STORE_ID}`).catch(err =>
        Alert.alert('Please check for the App Store'),
      );
    }
  };

  const handlePrivacyPolicyPress = async () => {
    const supported = await Linking.canOpenURL(
      'https://imageconverterking.netlify.app/privacy-policy',
    );

    if (supported) {
      await Linking.openURL('https://imageconverterking.netlify.app/privacy-policy');
    } else {
      Alert.alert(`Something went wrong`);
    }
  };

  const handleMoreFromUs = async () => {
    const supported = await Linking.canOpenURL(
      'https://play.google.com/store/apps/developer?id=Soft+Codes',
    );

    if (supported) {
      await Linking.openURL('https://play.google.com/store/apps/developer?id=Soft+Codes');
    } else {
      Alert.alert(`Something went wrong`);
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={{backgroundColor: theme.colors.background}}
      contentContainerStyle={{flex: 1, paddingTop: '8%', justifyContent: 'space-between'}}>
      <View>
        {/* <List.Item
          title={'Event planner'}
          description={'Guests, Todos, Chat'}
          left={() => (
            <Image
              style={{
                width: 60,
                height: 60,
                marginLeft: '7%',
              }}
              source={require('../assets/logo/logo.png')}
            />
          )}
          titleStyle={{fontWeight: 'bold', fontSize: 20}}
        />
        <Divider style={{marginBottom: '5%'}} /> */}

        <Drawer.Item
          label={'Privacy policy'}
          onPress={handlePrivacyPolicyPress}
          theme={{roundness: 0}}
          icon="file-document"
        />

        <Drawer.Item
          label={'Rate this app'}
          // onPress={openStore}
          theme={{roundness: 0}}
          icon="star-face"
        />
        <Drawer.Item
          label={'More from us'}
          onPress={handleMoreFromUs}
          theme={{roundness: 0}}
          icon="more"
        />
        {/* <List.Item
          title="Logout"
          onPress={() => logout()}
          left={() => <List.Icon icon="logout" color={theme.colors.error} />}
          style={{
            paddingHorizontal: '11%',
            marginVertical: '3%',
          }}
          titleStyle={{color: theme.colors.error}}
        /> */}
      </View>

      <View style={{marginVertical: '5%'}}>
        <Text style={{marginVertical: '5%', alignSelf: 'center'}}>Version {version}</Text>
      </View>
    </DrawerContentScrollView>
  );
}
