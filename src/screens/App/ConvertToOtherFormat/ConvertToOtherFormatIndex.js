import React, { useState} from 'react';
import {View, Text, Image, PermissionsAndroid} from 'react-native';
import ConvertToOtherFormatAppbar from '../../../components/Appbars/ConvertToOtherFormatAppbar';
import {useTheme, Button} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';

const ConvertToOtherFormatIndex = ({route, navigation}) => {
  const theme = useTheme();
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImagePicker = async () => {
    const options = {
      // title: 'Select Image',
      mediaType: 'photo',
      presentationStyle: 'popover',
      includeBase64: true,
      selectionLimit: 0,
      mimeTypes: "['image/png']",
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
        console.log('Storage permission granted');
        launchImageLibrary(options, response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            // console.log("else", response.assets[0])
            setSelectedImage(response.assets);
            setIsImageSelected(true);
          }
        });
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const convertAndSaveToPNG = async () => {
    const folderName = 'image-converter-king';

    try {
      const downloadDirPath = RNFS.DownloadDirectoryPath;
      const folderPath = `${downloadDirPath}/${folderName}`;
      const folderExists = await RNFS.exists(folderPath);
      if (!folderExists) {
        await RNFS.mkdir(folderPath);
      }

      for (let i = 0; i < selectedImage.length; i++) {
        const base64Data = selectedImage[i].base64;

        let fileName = `${selectedImage[i].fileName.split('.')[0]}.png`;
        let filePath = `${folderPath}/${fileName}`;
        let fileExists = await RNFS.exists(filePath);

        let count = 1;
        while (fileExists) {
          fileName = `${selectedImage[i].fileName.split('.')[0]} (${count}).png`;
          filePath = `${folderPath}/${fileName}`;
          fileExists = await RNFS.exists(filePath);
          count++;
        }
        await RNFS.writeFile(filePath, base64Data, 'base64');
      }

    } catch (error) {
      console.error('Error creating folder or writing file:', error);
    }
  };


  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <ConvertToOtherFormatAppbar
        title={`Convert to ${route?.params?.convertToExtention}`}
      />
      {!isImageSelected ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Button
            // onPress={()=>console.log("first")}
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
          
          <Image
            style={{
              width: 300,
              height: 350,
            }}
            source={{uri: selectedImage[0]?.uri}}
          />
          <Button
            onPress={convertAndSaveToPNG}
            style={{marginVertical: '10%', width:"80%"}}
            contentStyle={{padding: '3%'}}
            theme={{roundness: 20}}
            mode="contained"
            labelStyle={{fontSize: 18, fontWeight: '700'}}
            accessibilityLabel={`Convert to ${route?.params?.convertToExtention}`}>
            {`Convert to ${route?.params?.convertToExtention}`}
          </Button>
        </View>
      )}
    </View>
  );
};

export default ConvertToOtherFormatIndex;
