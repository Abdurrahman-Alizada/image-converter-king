import React, {useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
} from 'react-native';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import ConvertToOtherFormatAppbar from '../../../../components/Appbars/ConvertToOtherFormatAppbar';
import {Button, Chip, useTheme, TextInput, List} from 'react-native-paper';

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

const App = () => {
  const [selectedMode, setMode] = useState('contain');
  const [onlyScaleDown, setOnlyScaleDown] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);
  const [sizeHeight, setSizeHeight] = useState(80);
  const [sizeWidth, setSizeWidth] = useState(80);
  const [resizedImage, setResizedImage] = useState(null);
  const [inputImageUrl, setInputImageUrl] = useState('');

  const resize = async () => {
    if (!imageUri) return;

    setResizedImage(null);

    try {
      let result = await ImageResizer.createResizedImage(
        imageUri,
        sizeWidth,
        sizeHeight,
        'JPEG',
        100,
        0,
        undefined,
        false,
        {
          mode: selectedMode,
          onlyScaleDown,
        },
      );

      setResizedImage(result);
    } catch (error) {
      Alert.alert('Unable to resize the photo');
      console.log("first", error)
    }
  };

  const selectImageFromPicker = async () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (!response || !response.assets) return;
      const asset = response.assets[0];
      if (asset) {
        setImageDetails(asset)
        setSizeHeight(Number(asset.height))
        setSizeWidth(Number(asset.width))
        setImageUri(asset.uri);
      }
    });
  };

  const loadImageFromUrl = () => setImageUri(inputImageUrl);

  const saveImage = async () => {
    if (!resizedImage) {
      Alert.alert('No image to save');
      return;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const destPath = `${RNFS.DownloadDirectoryPath}/image-converter-king/resized_image.jpg`;
        await RNFS.copyFile(resizedImage.uri, destPath);
        Alert.alert('Success', 'Image saved successfully');
      } else {
        Alert.alert('Permission Denied', 'Unable to save image without permission');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save image');
    }
  };

  const theme = useTheme();

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
      <ConvertToOtherFormatAppbar title={'Compress image'} />
      <ScrollView contentContainerStyle={{paddingVertical: '3%', paddingHorizontal: '5%'}}>
        {imageUri ? (
          <View style={{marginTop: '2%', justifyContent:"flex-start"}}>
            <Image style={{height:300, width:"98%"}} source={{uri: imageUri}}  />
            <View style={{marginTop:"3%"}}>

            <Text style={{marginBottom:"2%"}}>Original image</Text>
            <Text style={{}}><Text style={{fontWeight:"bold"}}>Name:</Text>  {imageDetails.fileName}</Text>
            <Text style={{}}><Text style={{fontWeight:"bold"}}>Dimensions:</Text> {imageDetails.width} x {imageDetails.height} </Text>
            <Text style={{}}><Text style={{fontWeight:"bold"}}>Size:</Text> {formatFileSize(imageDetails.fileSize)} </Text>
            </View>
          </View>
        ) : (
          <Button
            onPress={selectImageFromPicker}
            style={{}}
            contentStyle={{padding: '4%'}}
            theme={{roundness: 20}}
            mode="contained"
            labelStyle={{fontSize: 18, fontWeight: '700'}}
            accessibilityLabel="Select image button">
            Select Image
          </Button>
        )}

        {/* 
        <TextInput
        style={styles.textInput}
        onChangeText={text => setInputImageUrl(text)}
        value={inputImageUrl}
        placeholder="url"
        placeholderTextColor={'grey'}
      />
      <View style={styles.imageSourceButtonContainer}>
        <TouchableOpacity style={styles.button} onPress={loadImageFromUrl}>
          <Text>Load image from url</Text>
        </TouchableOpacity>
      </View>
      */}

        <List.Accordion
          title="Output image settings"
          titleStyle={{fontWeight: '800', fontSize: 18}}
          left={props => <List.Icon {...props} icon="cog-outline" />}>
          <View style={{marginTop: '5%', flexDirection: 'row', justifyContent: 'space-between'}}>
            <TextInput
              mode="outlined"
              label="Image width:"
              value={sizeWidth.toString()}
              onChangeText={text => {
                const number = parseFloat(text);
                setSizeWidth(isNaN(number) ? 0 : number);
              }}
              keyboardType="decimal-pad"
              style={{width: '48%'}}
            />
            <TextInput
              mode="outlined"
              label="Image height:"
              value={sizeHeight.toString()}
              onChangeText={text => {
                const number = parseFloat(text);
                setSizeHeight(isNaN(number) ? 0 : number);
              }}
              keyboardType="decimal-pad"
              style={{width: '48%'}}
            />
          </View>
          <View style={{marginTop: '5%'}}>
            <Text>Mode: </Text>
            <View style={{flexDirection: 'row', marginTop: '3%'}}>
              {modeOptions.map((mode, index) => (
                <Chip
                  key={index}
                  mode={selectedMode === mode.value ? 'flat' : 'outlined'}
                  selected={mode === selectedMode}
                  onPress={() => setMode(mode.value)}
                  style={{marginRight: '4%'}}>
                  {mode.label}
                </Chip>
              ))}
            </View>
          </View>
          <View style={{marginTop: '5%'}}>
            <Text>Only scale down? </Text>
            <View style={{flexDirection: 'row', marginTop: '3%'}}>
              {onlyScaleDownOptions.map((scaleDownOption, index) => (
                <Chip
                  key={index}
                  mode={onlyScaleDown === scaleDownOption.value ? 'flat' : 'outlined'}
                  selected={onlyScaleDown === selectedMode}
                  onPress={() => setOnlyScaleDown(scaleDownOption.value)}
                  style={{marginRight: '4%'}}>
                  {scaleDownOption.label}
                </Chip>
              ))}
            </View>
          </View>
        </List.Accordion>

        <TouchableOpacity style={styles.button} onPress={resize}>
          <Text>Click to resize the image</Text>
        </TouchableOpacity>
        {resizedImage ? (
          <>
            <Text style={styles.instructions}>Resized image:</Text>
            <Image style={styles.image} source={{uri: resizedImage.uri}} resizeMode="contain" />
            <Text>Width: {resizedImage.width}</Text>
            <Text>Height: {resizedImage.height}</Text>
            {/* <Text>Size: {resizedImage.fileSize}</Text> */}
            <TouchableOpacity style={styles.button} onPress={saveImage}>
              <Text>Save Image</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#F5FCFF',
  },
  container: {
    paddingVertical: 100,
    paddingHorizontal: 10,
  },
  imageSourceButtonContainer: {
    marginBottom: 10,
  },
  welcome: {
    fontSize: 20,
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  image: {
    height: 250,
    marginBottom: 10,
  },
  resizeButton: {
    color: '#333333',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#2596be',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  optionContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  buttonOption: {
    backgroundColor: '#2596be',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  textInput: {
    height: 40,
    borderColor: 'black',
    borderWidth: 2,
    margin: 10,
    alignSelf: 'stretch',
    textAlign: 'center',
    overflow: 'hidden',
  },
});

export default App;
