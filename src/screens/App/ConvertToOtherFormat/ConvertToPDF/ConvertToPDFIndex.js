import React, {useState} from 'react';
import {createPdf} from 'react-native-images-to-pdf';
import {launchImageLibrary} from 'react-native-image-picker';
import {Image, ScrollView, Text, View} from 'react-native';
import {
  Button,
  Chip,
  List,
  TextInput,
  useTheme,
  Snackbar,
  IconButton,
  Divider,
} from 'react-native-paper';
import RNFS from 'react-native-fs';
import ConvertToOtherFormatAppbar from '../../../../components/Appbars/ConvertToOtherFormatAppbar';

const ConvertToPDFIndex = () => {
  const theme = useTheme();

  const [outputFilename, setOutputFileName] = useState('mypdf');
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [images, setImages] = useState([]);
  const [pdfGenerationComplete, setPDFGenerationComplete] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [width, setWidth] = useState(594);
  const [height, setHeight] = useState(842);
  const [imageFit, setImageFit] = useState('contain');

  const selectImages = async () => {
    setIsLoading(true);

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 0,
      });

      if (result.assets) {
        const pages = result.assets.map(asset => ({
          imagePath: asset.uri,
          imageFit,
          width,
          height,
          backgroundColor: 'white', // Assuming background color is always white
        }));
        setImages(pages);
      }
    } catch (e) {
      console.error('Failed to create PDF:', e);
    }
    setIsLoading(false);
    setIsImageSelected(true);
  };

  const handleCreatePDF = async () => {
    setIsLoading(true);

    try {
      const uri = await createPdf({
        outputPath: `${RNFS.DownloadDirectoryPath}/image-converter-king/${outputFilename}.pdf`,
        pages: images,
      });

      setPDFGenerationComplete(true);
      setVisible(true);
    } catch (error) {
      console.error('Failed to create PDF:', error);
    }

    setIsLoading(false);
  };

  const handleRemoveImage = index => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    setIsImageSelected(updatedImages.length > 0);
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <ConvertToOtherFormatAppbar title={`Create PDF from images`} />
      <View style={{flex: 1, justifyContent: 'space-between', padding: '5%'}}>
        {isImageSelected ? (
          <View style={{flex: 1, marginVertical: '5%', alignItems: 'center'}}>
            <ScrollView>
              {images.map((image, index) => (
                <View key={index} style={{position: 'relative'}}>
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
                    onPress={() => handleRemoveImage(index)}
                  />
                  <Image
                    style={{width: 300, height: 250, marginBottom: 5, resizeMode: 'cover'}}
                    source={{uri: image?.imagePath}}
                  />
                  <Divider />
                </View>
              ))}
            </ScrollView>
          </View>
        ) : (
          <View>
            <Button
              onPress={selectImages}
              loading={isLoading}
              disabled={isLoading}
              style={{marginVertical: '10%'}}
              contentStyle={{padding: '3%'}}
              theme={{roundness: 20}}
              mode="contained"
              labelStyle={{fontSize: 18, fontWeight: '700'}}
              accessibilityLabel="Generate pdf">
              Select images
            </Button>
            <Text style={{marginBottom: 10, fontWeight: 'bold'}}>Default settings</Text>
            <Text>Page width: {width ?? 'image width'}</Text>
            <Text>Page height: {height ?? 'image height'}</Text>
            <Text>Image fit: {imageFit ?? 'none'}</Text>
            <Text>Output file name: {outputFilename}</Text>
          </View>
        )}

        {isImageSelected && (
          <Button
            onPress={handleCreatePDF}
            loading={isLoading}
            disabled={pdfGenerationComplete || isLoading}
            style={{margin: '0%'}}
            contentStyle={{padding: '3%'}}
            theme={{roundness: 20}}
            mode="contained"
            labelStyle={{fontSize: 18, fontWeight: '700'}}
            accessibilityLabel="Generate pdf">
            Create
          </Button>
        )}

        <List.Section style={{marginBottom: '5%'}}>
          <List.Accordion
            title="PDF settings"
            titleStyle={{fontWeight: '800', fontSize: 18}}
            left={props => <List.Icon {...props} icon="cog-outline" />}>
            <View>
              <TextInput
                mode="outlined"
                label="Output file name"
                style={{marginBottom: '3%'}}
                value={outputFilename}
                onChangeText={setOutputFileName}
                autoCapitalize="none"
              />
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TextInput
                mode="outlined"
                label="Page width"
                style={{width: '48%'}}
                value={width ? width.toString() : ''}
                keyboardType="numeric"
                onChangeText={text => setWidth(parseFloat(text))}
              />
              <TextInput
                mode="outlined"
                label="Page height"
                style={{width: '48%'}}
                value={height ? height.toString() : ''}
                keyboardType="numeric"
                onChangeText={text => setHeight(parseFloat(text))}
              />
            </View>

            <View style={{marginVertical: '5%'}}>
              <Text>Image fit</Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: '0%',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}>
                {['none', 'cover', 'contain', 'fill'].map((fit, index) => (
                  <Chip
                    key={index}
                    mode={imageFit === fit ? 'flat' : 'outlined'}
                    selected={imageFit === fit}
                    onPress={() => setImageFit(fit)}
                    style={{marginTop: '4%'}}>
                    {fit}
                  </Chip>
                ))}
              </View>
            </View>
          </List.Accordion>
        </List.Section>
      </View>
      <Snackbar visible={visible} onDismiss={() => setVisible(false)}>
        PDF downloaded successfully.
      </Snackbar>
    </View>
  );
};

export default ConvertToPDFIndex;
