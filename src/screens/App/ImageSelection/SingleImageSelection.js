import {View, Text, PermissionsAndroid} from 'react-native';
import React from 'react';
import {Button, useTheme} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SingleImageSelection = ({navigation, route}) => {
  const theme = useTheme();
  const handleImagePicker = async () => {
    const options = {
      // title: 'Select Image',
      mediaType: 'photo',
      // presentationStyle: 'popover',
      includeBase64: true,
      selectionLimit: 1,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to save images.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        launchImageLibrary(options, async response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            console.log(response)
            await AsyncStorage.setItem('currentImageToProcess', JSON.stringify(response.assets[0]));
            navigation.navigate(route.params?.navigateTo);
          }
        });
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', backgroundColor: theme.colors.background}}>
      <Button
        onPress={handleImagePicker}
        style={{margin: '10%'}}
        contentStyle={{padding: '4%'}}
        theme={{roundness: 20}}
        mode="contained"
        labelStyle={{fontSize: 18, fontWeight: '700'}}
        accessibilityLabel="Select image button">
        Select Image
      </Button>
    </View>
  );
};

export default SingleImageSelection;
