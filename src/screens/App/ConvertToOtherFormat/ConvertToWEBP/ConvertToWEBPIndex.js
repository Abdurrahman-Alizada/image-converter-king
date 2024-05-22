import React, {useState} from 'react';
import {Alert, Image, ScrollView, StyleSheet, Text, View, PermissionsAndroid} from 'react-native';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import ConvertToOtherFormatAppbar from '../../../../components/Appbars/ConvertToOtherFormatAppbar';
import {Button, Divider, useTheme} from 'react-native-paper';
import getPath from '../../../../utils/getPath';
import formatFileSize from '../../../../utils/formatFileSize';

const modeOptions = [
  {
    label: 'contain',
    value: 'contain',
  },
  {
    label: 'cover',
    value: 'cover',
  },
  {
    label: 'stretch',
    value: 'stretch',
  },
];

const onlyScaleDownOptions = [
  {
    label: 'true',
    value: true,
  },
  {
    label: 'false',
    value: false,
  },
];

const ConvertToWebpIndex = () => {
  const [selectedMode, setMode] = useState('contain');
  const [onlyScaleDown, setOnlyScaleDown] = useState(true);
  const [images, setImages] = useState([]);
  const [resizedImages, setResizedImages] = useState([]);
  const [inputImageUrl, setInputImageUrl] = useState('');

  const theme = useTheme();

  const resizeImage = async (imageUri, width, height) => {
    try {
      let result = await ImageResizer.createResizedImage(
        imageUri,
        width,
        height,
        'WEBP',
        70,
        0,
        undefined,
        false,
        {onlyScaleDown, mode: selectedMode},
      );
      return result;
    } catch (error) {
      console.error('Error resizing image:', error);
      return null;
    }
  };

  const handleImageSelection = async () => {
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
    launchImageLibrary(options, response => {
      if (!response || !response.assets) return;
      const newImages = response.assets.map(asset => ({
        uri: asset.uri,
        width: Number(asset.width),
        height: Number(asset.height),
        fileName: asset.fileName,
        fileSize: asset.fileSize,
      }));
      setImages(newImages);
    });
  };

  const resizeImages = async () => {
    const resized = await Promise.all(
      images.map(async image => {
        const resizedImage = await resizeImage(image.uri, image.width, image.height);
        return resizedImage;
      }),
    );
    setResizedImages(resized);
  };

  const saveImages = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await Promise.all(
          resizedImages.map(async (resizedImage, index) => {
            const destPath = await getPath({
              folderName: 'WEBP',
              fileName: images[index].fileName.split('.')[0],
              extention: 'webp',
            });
            await RNFS.copyFile(resizedImage.uri, destPath);
          }),
        );
        Alert.alert('Success', 'Images saved successfully');
      } else {
        Alert.alert('Permission Denied', 'Unable to save images without permission');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save images');
      console.error('Error saving images:', error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <ConvertToOtherFormatAppbar title={'Convert to WEBP'} />
      <View style={{flex: 1}}>
        <ScrollView contentContainerStyle={{paddingVertical: '3%', paddingHorizontal: '5%'}}>
          {images.length === 0 ? (
            <Button
              onPress={handleImageSelection}
              style={{}}
              contentStyle={{padding: '4%'}}
              theme={{roundness: 20}}
              mode="contained"
              labelStyle={{fontSize: 18, fontWeight: '700'}}
              accessibilityLabel="Select images button">
              Select Images
            </Button>
          ) : (
            <>
              <View style={{alignItems: 'center', marginVertical: '4%'}}>
                {!resizedImages.length &&
                  images.map((image, index) => (
                    <Image
                      key={index}
                      style={{height: 300, width: 250, margin: 5}}
                      source={{uri: image.uri}}
                    />
                  ))}
              </View>
            </>
          )}
          {resizedImages.length > 0 && (
            <>
              <View style={{marginVertical: '4%'}}>
                {resizedImages.map((resizedImage, index) => (
                  <View key={index} style={{flexDirection: 'row', marginVertical: '3%'}}>
                    <Image style={{height: 80, width: 80}} source={{uri: resizedImage.uri}} />
                    <View style={{marginLeft: '5%'}}>
                      <Text>Name: {images[index].fileName}</Text>
                      <Text>Dimensions: {resizedImage.width} x {resizedImage.height}</Text>
                      <Text>Size: {formatFileSize(resizedImage.size)}</Text>
                    </View>
                    <Divider style={{height:3}} />
                  </View>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      </View>
      <View style={{alignItems: 'center'}}>
        {images?.length > 0 && resizedImages.length <= 0 && (
          <Button
            onPress={resizeImages}
            style={{marginVertical: '5%', width: '80%'}}
            contentStyle={{padding: '3%'}}
            theme={{roundness: 20}}
            mode="contained"
            labelStyle={{fontSize: 16, fontWeight: '700'}}
            accessibilityLabel={`Convert to webp button`}>
            {`Convert ${images?.length} images to WEBP`}
          </Button>
        )}
        {resizedImages.length > 0 && (
          <Button
            onPress={saveImages}
            style={{marginVertical: '5%', width: '80%'}}
            contentStyle={{padding: '3%'}}
            theme={{roundness: 20}}
            mode="contained"
            labelStyle={{fontSize: 16, fontWeight: '700'}}
            accessibilityLabel={`save WEBP images button`}>
            {`Save images`}
          </Button>
        )}
      </View>
    </View>
  );
};

export default ConvertToWebpIndex;
