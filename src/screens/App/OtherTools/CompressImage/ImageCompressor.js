import React, {useState} from 'react';
import {View, Image, Alert, PermissionsAndroid} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Image as ImageCompressor} from 'react-native-compressor';
import ConvertToOtherFormatAppbar from '../../../../components/Appbars/ConvertToOtherFormatAppbar';
import {useTheme, Button, IconButton, Text, Chip} from 'react-native-paper';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';

const ImageCompressorIndex = () => {
  const theme = useTheme();
  const navigation = useNavigation()

  const [imageUri, setImageUri] = useState(null);
  const [image, setImage] = useState(null);
  const [isDownloadShow, setIsDownloadShow] = useState(false);
  const [quality, setQuality] = useState({value: 0.8, label: '80%'});
  const qualities = [
    {value: 0.2, label: '20%'},
    {value: 0.3, label: '30%'},
    {value: 0.4, label: '40%'},
    {value: 0.5, label: '50%'},
    {value: 0.6, label: '60%'},
    {value: 0.7, label: '70%'},
    {value: 0.8, label: '80%'},
    {value: 0.9, label: '90%'},
  ];

  const selectImage = async () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (!response || !response.assets) return;
      const asset = response.assets[0];
      if (asset) {
        setImage(asset);
        setImageUri(asset.uri);
      }
    });
  };

  const compressImage = async () => {
    try {
      const compressedImage = await ImageCompressor.compress(imageUri, {
        quality: quality.value,
      });

      const fileInfo = await RNFS.stat(compressedImage);
      const widthHeight = await getImageSize(compressedImage);
      setImage({
        fileName: image.fileName,
        fileSize: fileInfo.size,
        width: widthHeight.width,
        height: widthHeight.height,
      });
      setImageUri(compressedImage);
      setIsDownloadShow(true);
    } catch (error) {
      console.error('Failed to compress image: ', error);
      Alert.alert('Error', 'Failed to compress image. Please try again.');
    }
  };
  const getImageSize = path => {
    return new Promise((resolve, reject) => {
      Image.getSize(
        `file://${path}`,
        (width, height) => {
          resolve({width, height});
        },
        reject,
      );
    });
  };

  const downloadImage = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const filePath = await getPath();
        await RNFS.copyFile(imageUri, filePath);
        Alert.alert('Success', `Image saved successfully in download folder`);
        navigation.goBack()
      } else {
        Alert.alert('Permission Denied', 'Unable to save image without permission');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save image');
    }
  };

  const getPath = async () => {
    const folderName = 'image-converter-king/compressed-images';

    try {
      const downloadDirPath = RNFS.DownloadDirectoryPath;
      const folderPath = `${downloadDirPath}/${folderName}`;
      const folderExists = await RNFS.exists(folderPath);
      if (!folderExists) {
        await RNFS.mkdir(folderPath);
      }

      let fileName = `${image.fileName}`;
      let filePath = `${folderPath}/${fileName}`;
      let fileExists = await RNFS.exists(filePath);

      let count = 1;
      while (fileExists) {
        fileName = `${image.fileName} (${count}).jpg`;
        filePath = `${folderPath}/${fileName}`;
        fileExists = await RNFS.exists(filePath);
        count++;
      }
      return filePath;
    } catch (error) {
      console.error('Error creating folder or writing file:', error);
    }
  };

  function formatFileSize(bytes) {
    if (bytes < 1024) {
      return bytes + ' Bytes';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else if (bytes < 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <ConvertToOtherFormatAppbar title={'Image compressor'} />
      <View style={{margin: '5%'}}>
        {imageUri ? (
          <>
            <View style={{position: 'relative'}}>
              <IconButton
                style={{
                  position: 'absolute',
                  backgroundColor: theme.colors.errorContainer,
                  top: 0,
                  right: 0,
                  zIndex: 999,
                }}
                icon="close"
                size={20}
                onPress={() => {
                  setImageUri(null);
                  setIsDownloadShow(false);
                }}
              />
              <Image
                style={{height: 300, marginBottom: 5, resizeMode: "center"}}
                source={{uri: imageUri}}

              />
              <View style={{marginTop: '3%'}}>
                <Text style={{marginBottom: '2%'}}>
                  {!isDownloadShow ? 'Original' : 'Resized'} image
                </Text>
                <Text style={{}}>
                  <Text style={{fontWeight: 'bold'}}>Name:</Text> {image.fileName}
                </Text>
                <Text style={{}}>
                  <Text style={{fontWeight: 'bold'}}>Dimensions:</Text> {image.width} x{' '}
                  {image.height}{' '}
                </Text>
                <Text style={{}}>
                  <Text style={{fontWeight: 'bold'}}>Size:</Text> {formatFileSize(image.fileSize)}{' '}
                </Text>
              </View>
              <View style={{marginTop:"3%"}}>
                <Text>Reduce size:</Text>
                <View style={{flexDirection: 'row',marginTop: '1%', flexWrap: 'wrap'}}>
                  {qualities.map((q, index) => (
                    <Chip
                      key={index}
                      mode={quality.value === q.value ? 'flat' : 'outlined'}
                      selected={quality.value === q.value}
                      disabled={isDownloadShow}
                      onPress={() => setQuality(q)}
                      style={{marginRight: '4%', marginTop: '1%'}}>
                      {q.label}
                    </Chip>
                  ))}
                </View>
              </View>
            </View>

            {isDownloadShow ? (
              <Button
                onPress={downloadImage}
                style={{marginTop: '4%'}}
                contentStyle={{padding: '3%'}}
                theme={{roundness: 20}}
                mode="contained"
                labelStyle={{fontSize: 18, fontWeight: '700'}}
                accessibilityLabel="Download image button">
                Download Image
              </Button>
            ) : (
              <Button
                onPress={compressImage}
                style={{marginTop: '4%'}}
                contentStyle={{padding: '3%'}}
                theme={{roundness: 20}}
                mode="contained"
                labelStyle={{fontSize: 18, fontWeight: '700'}}
                accessibilityLabel="Compress image button">
                Compress Image
              </Button>
            )}
            
          </>
        ) : (
          <Button
            onPress={selectImage}
            style={{}}
            contentStyle={{padding: '4%'}}
            theme={{roundness: 20}}
            mode="contained"
            labelStyle={{fontSize: 18, fontWeight: '700'}}
            accessibilityLabel="Select image button">
            Select Image
          </Button>
        )}
      </View>
    </View>
  );
};

export default ImageCompressorIndex;
