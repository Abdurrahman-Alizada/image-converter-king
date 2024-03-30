import React, {useRef, useState} from 'react';
import {View, Text, Image, PermissionsAndroid, ScrollView} from 'react-native';
import ConvertToOtherFormatAppbar from '../../../../components/Appbars/ConvertToOtherFormatAppbar';
import {useTheme, Button, ActivityIndicator, Icon, Snackbar} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConvertToPNGIndex = ({route, navigation}) => {
  const theme = useTheme();
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [selectedImages, setselectedImages] = useState(null);
  const [convertLoading, setConvertLoading] = useState(false);
  const [isImageConversionComplete, setIsImageConversionComplete] = useState(false);
  const [imageDownloadSuccessfully, setImageDownloadSuccessfully] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleImagePicker = async () => {
    const options = {
      // title: 'Select Image',
      mediaType: 'photo',
      // presentationStyle: 'popover',
      includeBase64: true,
      selectionLimit: 3,
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
        launchImageLibrary(options, response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            setselectedImages(response.assets);
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
    setConvertLoading(true);
    const folderName = 'image-converter-king';

    try {
      const downloadDirPath = RNFS.DownloadDirectoryPath;
      const folderPath = `${downloadDirPath}/${folderName}`;
      const folderExists = await RNFS.exists(folderPath);
      if (!folderExists) {
        await RNFS.mkdir(folderPath);
      }

      let convertedImagesData = [];

      for (let i = 0; i < selectedImages.length; i++) {
        const base64Data = selectedImages[i].base64;

        let fileName = `${selectedImages[i].fileName.split('.')[0]}.png`;
        let filePath = `${folderPath}/${fileName}`;
        let fileExists = await RNFS.exists(filePath);

        let count = 1;
        while (fileExists) {
          fileName = `${selectedImages[i].fileName.split('.')[0]} (${count}).png`;
          filePath = `${folderPath}/${fileName}`;
          fileExists = await RNFS.exists(filePath);
          count++;
        }
        convertedImagesData.push({filePath, base64Data});
      }

      await AsyncStorage.setItem('convertedImages', JSON.stringify(convertedImagesData));
      convertedImagesData=null
    } catch (error) {
      console.error('Error creating folder or writing file:', error);
    }
    setConvertLoading(false);
    setIsImageConversionComplete(true);
  };

  const handleDownloadToGallery = async () => {
    try {
      const convertedImagesData = await AsyncStorage.getItem('convertedImages');
      if (convertedImagesData) {
        const images = JSON.parse(convertedImagesData);
        for (let i = 0; i < images.length; i++) {
          await saveImageToGallery(images[i].filePath, images[i].base64Data);
        }
      }
      setImageDownloadSuccessfully(true);
      setVisible(true);
    } catch (error) {
      console.error('Error downloading images to gallery:', error);
    }
  };

  const saveImageToGallery = async (filePath, base64Data) => {
    try {
      await RNFS.writeFile(filePath, base64Data, 'base64');
    } catch (error) {
      console.error('Error saving image to gallery:', error);
    }
  };

  const furtherActions = [
    {icon: 'image-edit-outline', name: 'Edit', navigateTo: 'EditingScreen'},
    {icon: 'arrow-collapse-all', name: 'Compress', navigateTo: 'EditingScreen'},
    {icon: 'resize', name: 'Resize', navigateTo: 'EditingScreen'},
    {icon: 'folder-zip-outline', name: 'Zip', navigateTo: 'EditingScreen'},
    {icon: 'share-variant-outline', name: 'Share', navigateTo: 'EditingScreen'},
  ];

  // Function to convert file size to human-readable format
  const formatFileSize = sizeInBytes => {
    if (sizeInBytes >= 1024 * 1024 * 1024) {
      return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    } else if (sizeInBytes >= 1024 * 1024) {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    } else if (sizeInBytes >= 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else {
      return `${sizeInBytes} Bytes`;
    }
  };

  return (
    <View style={{flexGrow: 1, backgroundColor: theme.colors.background}}>
      <ConvertToOtherFormatAppbar title={`Convert to PNG`} />

      <View style={{flex: 1}}>
        <ScrollView contentContainerStyle={{}}>
          {isImageConversionComplete ? (
            <View style={{marginHorizontal: '5%'}}>
              {selectedImages.map((selectedImage, index) => (
                <View key={index} style={{flexDirection: 'row', marginTop: '4%'}}>
                  <View style={{height: 80, width: 80}}>
                    <Image
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      source={{uri: selectedImages[0]?.uri}}
                    />
                  </View>
                  <View style={{marginHorizontal: '5%'}}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>{`${
                      selectedImage?.fileName?.split('.')[0]
                    }.png`}</Text>
                    <Text style={{}}>
                      Dimensions: {selectedImage.height} x {selectedImage.width}
                    </Text>
                    <Text style={{}}>size: {formatFileSize(selectedImage.fileSize)} </Text>
                  </View>
                </View>
              ))}

              <Button
                onPress={handleDownloadToGallery}
                style={{marginTop: '10%'}}
                contentStyle={{padding: '3%'}}
                theme={{roundness: 20}}
                mode="contained"
                labelStyle={{fontSize: 18, fontWeight: '700'}}
                icon={'download'}
                disabled={imageDownloadSuccessfully}
                accessibilityLabel="Select image button">
                Download
              </Button>
              {imageDownloadSuccessfully && (
                <Text style={{marginTop: '5%'}}>
                  * Your images downloaded to Download/image-converter-king folder
                </Text>
              )}
              <View
                style={{
                  backgroundColor: theme.colors.greyLight,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  padding: '5%',
                  borderRadius: 5,
                  marginTop: '10%',
                }}>
                {furtherActions?.map((furtherAction, index) => (
                  <View
                    key={index}
                    style={{alignItems: 'center', marginBottom: '5%', width: '33.3%'}}>
                    <Icon source={furtherAction.icon} size={40} />
                    <Text style={{fontSize: 18}}>{furtherAction.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={{flexGrow: 1}}>
              {!isImageSelected ? (
                <View style={{flex: 1, justifyContent: 'center'}}>
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
                  {selectedImages.map((selectedImage, index) => (
                    <Image
                      key={index}
                      style={{
                        width: 300,
                        height: 350,
                        marginBottom: 5,
                      }}
                      source={{uri: selectedImage?.uri}}
                    />
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>

      {!isImageConversionComplete && isImageSelected && (
        <View style={{alignItems: 'center'}}>
          {convertLoading ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <ActivityIndicator style={{marginVertical: '5%', marginRight: '5%'}} />
              <Text>Converting image to PNG</Text>
            </View>
          ) : (
            <Button
              onPress={convertAndSaveToPNG}
              style={{marginVertical: '5%', width: '80%'}}
              contentStyle={{padding: '3%'}}
              theme={{roundness: 20}}
              mode="contained"
              labelStyle={{fontSize: 16, fontWeight: '700'}}
              accessibilityLabel={`Convert to PNG`}>
              {`Convert ${selectedImages?.length} images to PNG`}
            </Button>
          )}
        </View>
      )}

      <Snackbar visible={visible} onDismiss={() => setVisible(false)}>
        Image downloaded successfully.
      </Snackbar>
    </View>
  );
};

export default ConvertToPNGIndex;
