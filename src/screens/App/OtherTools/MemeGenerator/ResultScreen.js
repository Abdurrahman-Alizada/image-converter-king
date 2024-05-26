// ResultScreen.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  CameraRoll,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
// import { saveImage } from './utils'; // Assuming saveImage function is implemented in utils.js
import RNFS from 'react-native-fs';
import {Button} from 'react-native-paper';

const deviceWidth = Dimensions.get('window').width;

const ResultScreen = ({top, bottom, meme, showResult, onToggleResult}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (showResult) {
      setLoaded(false);
    }
  }, [showResult]);

  const handleSaveImage = async () => {
    try {
      const uri = `http://memegen.link/${meme}/${top}/${bottom}.jpg`;
      await saveImage(uri, top, bottom); // Utilize a function to save the image
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const saveImage = async (uri, top, bottom) => {
    try {
      const path = `${RNFS.DownloadDirectoryPath}/image-converter-king/Memes`;
      const exists = await RNFS.exists(path);
      if (!exists) {
        await RNFS.mkdir(path);
      }
      const fileName = `${top}_${bottom}.jpg`;

      // Create the destination path
      let destination = `${path}/${fileName}`;

      // Check if the file already exists
      let fileExists = await RNFS.exists(destination);
      let count = 1;
      while (fileExists) {
        // Append a number to the file name if it already exists
        destination = `${path}/${top}_${bottom}(${count}).jpg`;
        fileExists = await RNFS.exists(destination);
        count++;
      }

      // Download the image
      const downloadOptions = {
        fromUrl: uri,
        toFile: destination,
        background: true, // Download in the background even if the app is closed
        progressDivider: 1, // Report progress in 1% increments
        progressInterval: 1000, // Report progress every second
      };

      const downloadResult = await RNFS.downloadFile(downloadOptions).promise;
      if (downloadResult.statusCode === 200) {
        Alert.alert('Download Success', 'Image downloaded successfully');
        return destination;
      } else {
        throw new Error('Failed to download image');
      }
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Save Error', 'Failed to save image');
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {!loaded && <ActivityIndicator />}
        <Image
          source={{uri: `http://memegen.link/${meme}/${top}/${bottom}.jpg`}}
          resizeMode={'contain'}
          style={{width: deviceWidth, height: deviceWidth}}
          onLoad={() => setLoaded(true)}
        />
      </View>

      {loaded && (
        <Button
          onPress={handleSaveImage}
          mode="contained"
          style={{margin: 15}}
          contentStyle={{padding: '3%'}}
          theme={{roundness: 20}}>
          💾 Save
        </Button>
      )}

      <Button
        onPress={onToggleResult}
        mode="contained"
        style={{margin: 15}}
        contentStyle={{padding: '3%'}}
        theme={{roundness: 20}}>
        💩 Generate Again
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  button: {
    margin: 10,
    backgroundColor: '#01afee',
    padding: 15,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default ResultScreen;
