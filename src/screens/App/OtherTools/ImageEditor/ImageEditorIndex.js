import {PermissionsAndroid, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import PhotoEditor from '@baronha/react-native-photo-editor';
import {Button, useTheme} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import ConvertToOtherFormatAppbar from '../../../../components/Appbars/ConvertToOtherFormatAppbar';
export default function ImageEditorIndex() {
  const theme = useTheme();

  const [isImageSelected, setIsImageSelected] = useState(false);

  const handleImagePicker = async () => {

    const options = {
      mediaType: 'photo',
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
            const editorOptions = {path: response.assets[0].uri};
            const result = await PhotoEditor.open(editorOptions);
            console.log('first result', result);
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
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <ConvertToOtherFormatAppbar title="Edit image" />
      <View style={{}}>
        {!isImageSelected ? (
          <View style={{}}>
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
        ) : (
          <View style={{flex: 1, marginVertical: '5%', alignItems: 'center'}}>
            {/* {selectedImages.map((selectedImage, index) => (
              <Image
                key={index}
                style={{
                  width: 300,
                  height: 350,
                  marginBottom: 5,
                }}
                source={{uri: selectedImage?.uri}}
              />
            ))} */}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
