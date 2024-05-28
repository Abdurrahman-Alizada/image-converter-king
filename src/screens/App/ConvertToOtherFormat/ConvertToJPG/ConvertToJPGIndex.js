import React, {useState} from 'react';
import {View, Text, Image, PermissionsAndroid, ScrollView, Alert} from 'react-native';
import ConvertToOtherFormatAppbar from '../../../../components/Appbars/ConvertToOtherFormatAppbar';
import {useTheme, Button, ActivityIndicator, Icon, Snackbar} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import formatFileSize from '../../../../utils/formatFileSize';
import getPath from '../../../../utils/getPath';

const ConvertToJPGIndex = () => {
  const theme = useTheme();
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [selectedImages, setselectedImages] = useState(null);
  const [convertLoading, setConvertLoading] = useState(false);
  const [isImageConversionComplete, setIsImageConversionComplete] = useState(false);
  const [imageDownloadSuccessfully, setImageDownloadSuccessfully] = useState(false);
  const [visible, setVisible] = useState(false);
  const [convertedImages, setConvertedImages] = useState([]);

  const handleImagePicker = async () => {
    const options = {
      mediaType: 'photo',
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

  const convertToJPG = async () => {
    setConvertLoading(true);

    try {
      for (let i = 0; i < selectedImages.length; i++) {
        const destPath = await getPath({
          folderName: 'JPG',
          fileName: selectedImages[i].fileName.split('.')[0],
          extention: 'jpg',
        });
        setConvertedImages([
          ...convertedImages,
          {filePath: destPath, base64Data: selectedImages[i].base64},
        ]);
      }
    } catch (error) {
      console.error('Error creating folder or writing file:', error);
    }
    setConvertLoading(false);
    setIsImageConversionComplete(true);
  };

  const handleDownloadToGallery = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        for (let i = 0; i < convertedImages.length; i++) {
          await RNFS.writeFile(
            convertedImages[i].filePath,
            convertedImages[i].base64Data,
            'base64',
          );
        }
      } else {
        Alert.alert('Permission Denied', 'Unable to save images without permission');
      }
      setImageDownloadSuccessfully(true);
      setVisible(true);
    } catch (error) {
      console.error('Error downloading images to gallery:', error);
    }
  };

  // const furtherActions = [
  //   {icon: 'image-edit-outline', name: 'Edit', navigateTo: 'EditingScreen'},
  //   {icon: 'arrow-collapse-all', name: 'Compress', navigateTo: 'EditingScreen'},
  //   {icon: 'resize', name: 'Resize', navigateTo: 'EditingScreen'},
  //   {icon: 'folder-zip-outline', name: 'Zip', navigateTo: 'EditingScreen'},
  //   {icon: 'share-variant-outline', name: 'Share', navigateTo: 'EditingScreen'},
  // ];

  return (
    <View style={{flexGrow: 1, backgroundColor: theme.colors.background}}>
      <ConvertToOtherFormatAppbar title={`Convert to JPG`} />

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
                    }.jpg`}</Text>
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
                accessibilityLabel="Download image">
                Download
              </Button>

              {imageDownloadSuccessfully && (
                <Text style={{marginTop: '5%'}}>
                  * Your images downloaded to Download/image-converter-king folder
                </Text>
              )}
              {/* <View
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
              </View> */}
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
                    <View key={index}>
                      <Image
                        style={{
                          width: 250,
                          height: 300,
                          marginBottom: 5,
                        }}
                        source={{uri: selectedImage?.uri}}
                      />
                      <View style={{marginVertical: '3%'}}>
                        <Text style={{}}>
                          <Text style={{fontWeight: 'bold'}}>Name: </Text>
                          {selectedImage.fileName}
                        </Text>
                        <Text style={{}}>
                          <Text style={{fontWeight: 'bold'}}>Dimensions:</Text>{' '}
                          {selectedImage.width} x {selectedImage.height}
                        </Text>
                        <Text style={{}}>
                          <Text style={{fontWeight: 'bold'}}>Size: </Text>
                          {formatFileSize(selectedImage.fileSize)}
                        </Text>
                      </View>
                    </View>
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
              <Text>Converting image to JPG</Text>
            </View>
          ) : (
            <Button
              onPress={convertToJPG}
              style={{marginVertical: '5%', width: '80%'}}
              contentStyle={{padding: '3%'}}
              theme={{roundness: 20}}
              mode="contained"
              labelStyle={{fontSize: 16, fontWeight: '700'}}
              accessibilityLabel={`Convert to JPG`}>
              {`Convert ${selectedImages?.length} images to JPG`}
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

export default ConvertToJPGIndex;
