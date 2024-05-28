// ResultScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import RNFS from 'react-native-fs';
import { Button } from 'react-native-paper';

const deviceWidth = Dimensions.get('window').width;

const ResultScreen = ({ top, bottom, meme, showResult, onToggleResult }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (showResult) {
      setLoaded(false);
    }
  }, [showResult]);

  const handleSaveImage = async () => {
    try {
      const uri = `http://memegen.link/${meme}/${top}/${bottom}.jpg`;
      await saveImage(uri, top, bottom);
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

      let destination = `${path}/${fileName}`;
      let fileExists = await RNFS.exists(destination);
      let count = 1;
      while (fileExists) {
        destination = `${path}/${top}_${bottom}(${count}).jpg`;
        fileExists = await RNFS.exists(destination);
        count++;
      }

      const downloadOptions = {
        fromUrl: uri,
        toFile: destination,
        background: true,
        progressDivider: 1,
        progressInterval: 1000,
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
      <View style={styles.imageContainer}>
        {!loaded && <ActivityIndicator />}
        <Image
          source={{ uri: `http://memegen.link/${meme}/${top}/${bottom}.jpg` }}
          resizeMode={'contain'}
          style={styles.image}
          onLoad={() => setLoaded(true)}
        />
      </View>

      {loaded && (
        <View style={styles.buttonsContainer}>
          <Button
            onPress={handleSaveImage}
            mode="contained"
            style={styles.button}
            contentStyle={styles.buttonContent}
            theme={{ roundness: 20 }}
            accessibilityLabel="Save image button"
          >
            💾 Save
          </Button>

          <Button
            onPress={onToggleResult}
            mode="contained"
            style={styles.button}
            contentStyle={styles.buttonContent}
            theme={{ roundness: 20 }}
            accessibilityLabel="Generate again button"
          >
            💩 Generate Again
          </Button>
        </View>
      )}
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
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: deviceWidth,
    height: deviceWidth,
  },
  buttonsContainer: {
    padding: 15,
  },
  button: {
    marginVertical: 10,
  },
  buttonContent: {
    padding: '3%',
  },
});

export default ResultScreen;
