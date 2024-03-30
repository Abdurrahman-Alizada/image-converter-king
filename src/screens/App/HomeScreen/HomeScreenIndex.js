import {Image, TouchableOpacity, View} from 'react-native';
import React from 'react';
import HomeScreenAppbar from '../../../components/Appbars/HomeScreenAppbar';
import {useTheme, Text, Avatar} from 'react-native-paper';

const HomeScreen = ({navigation}) => {
  const theme = useTheme();

  const convertCardsData = [
    {
      name: 'To JPG',
      image: require('../../../assets/HomeScreen/JPG.png'),
      abbr: 'JPG',
    },
    {
      name: 'To PNG',
      image: require('../../../assets/HomeScreen/PNG.png'),
      abbr: 'PNG',
    },
    {
      name: 'To SVG',
      image: require('../../../assets/HomeScreen/SVG.png'),
      abbr: 'SVG',
    },
    {
      name: 'To PDF',
      image: require('../../../assets/HomeScreen/PDF.png'),
      abbr: 'PDF',
    },
    {
      name: 'To GIF',
      image: require('../../../assets/HomeScreen/GIFF.png'),
      abbr: 'GIF',
    },
  ];

  const otherToolsCardsData = [
    {
      name: 'Meme generator',
      image: require('../../../assets/HomeScreen/meme.png'),
      abbr: 'memegene',
    },
    {
      name: 'Edit image',
      image: require('../../../assets/HomeScreen/edit.png'),
      abbr: 'imageEditor',
      navigateTo:"ImageEditor"
    },
    {
      name: 'Compress image',
      image: require('../../../assets/HomeScreen/zip.png'),
      abbr: 'svg',
    },
  ];

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <HomeScreenAppbar title={'Image convert - King'} isElevated={true} />

      <View style={{paddingHorizontal: '5%', paddingVertical: '7%'}}>
        <Text
          style={{fontWeight: '700', fontSize: 16, color: theme.colors.grey}}>
          Convert image
        </Text>
        <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
          {convertCardsData?.map((item, index) => (
            <TouchableOpacity
              // onPress={()=>navigation.navigate("ConvertToOtherFormat",{convertToExtention:item.abbr})}
              onPress={()=>navigation.navigate(`ConvertTo${item.abbr}`)}
              key={index}
              style={{
                marginRight:
                  index !== convertCardsData.length - 2 ? 'auto' : '3.33%',
                borderColor: theme.colors.grey,
                width: '30%',
                alignItems: 'center',
                borderWidth: 1,
                paddingVertical: '5%',
                borderRadius: 5,
                marginVertical: '4%',
              }}>
              <Image
                style={{
                  width: 55,
                  height: 60,
                }}
                source={item?.image}
              />
              <Text
                style={{
                  marginTop: 10,
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: theme.colors.grey,
                }}>
                {item?.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{marginTop: '10%'}}>
          <Text
            style={{fontWeight: '700', fontSize: 16, color: theme.colors.grey}}>
            Other tools
          </Text>

          <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
            {otherToolsCardsData?.map((item, index) => (
              <TouchableOpacity
                key={index}
                // onPress={()=>navigation.navigate("SingleImageSelection", {navigateTo:item.navigateTo})}
                onPress={()=>navigation.navigate(item.navigateTo)}
                style={{
                  marginRight:
                    index !== otherToolsCardsData.length - 2 ? 'auto' : '3.33%',
                  borderColor: theme.colors.grey,
                  width: '30%',
                  alignItems: 'center',
                  borderWidth: 1,
                  paddingVertical: '5%',
                  borderRadius: 5,
                  marginVertical: '4%',
                }}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  source={item?.image}
                />
                <Text
                  style={{
                    marginTop: 10,
                    fontWeight: '700',
                    fontSize: 16,
                    color: theme.colors.grey,
                    textAlign: 'center',
                  }}>
                  {item?.name ? item.name.replace(' ', '\n') : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
