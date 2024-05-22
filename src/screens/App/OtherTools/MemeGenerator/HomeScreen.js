// HomeScreen.js
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import ResultScreen from './ResultScreen';
import {Button, Icon} from 'react-native-paper';

const deviceWidth = Dimensions.get('window').width;
const widthHalves = deviceWidth / 3;

const MEMES = [
  'tenguy',
  'afraid',
  'older',
  'aag',
  'tried',
  'biw',
  'stew',
  'blb',
  'kermit',
  'bd',
  'ch',
  'cbg',
  'wonka',
  'cb',
  'keanu',
  'dsm',
  'live',
  'ants',
  'doge',
  'alwaysonbeat',
  'ermg',
  'facepalm',
  'firsttry',
  'fwp',
  'fa',
  'fbf',
  'fmr',
  'fry',
  'ggg',
  'hipster',
  'icanhas',
  'crazypills',
  'mw',
  'noidea',
  'regret',
  'boat',
  'hagrid',
  'sohappy',
  'captain',
  'bender',
  'inigo',
  'iw',
  'ackbar',
  'happening',
  'joker',
  'ive',
  'll',
  'away',
  'morpheus',
  'mb',
  'badchoice',
  'mmm',
  'jetpack',
  'imsorry',
  'red',
  'mordor',
  'oprah',
  'oag',
  'remembers',
  'philosoraptor',
  'jw',
  'patrick',
  'rollsafe',
  'sad-obama',
  'sad-clinton',
  'sadfrog',
  'sad-bush',
  'sad-biden',
  'sad-boehner',
  'saltbae',
  'sarcasticbear',
  'dwight',
  'sb',
  'ss',
  'sf',
  'dodgson',
  'money',
  'snek',
  'sohot',
  'nice',
  'awesome',
  'awesome',
  'awkward',
  'awkward',
  'fetch',
  'success',
  'scc',
  'ski',
  'officespace',
  'interesting',
  'toohigh',
  'bs',
  'fine',
  'sparta',
  'center',
  'both',
  'winter',
  'xy',
  'buzz',
  'yodawg',
  'yuno',
  'yallgot',
  'bad',
  'elf',
  'chosen',
];

const MEMELIST = MEMES.map((meme, i) => ({id: i, meme}));

const HomeScreen = () => {
  const [top, setTop] = useState('');
  const [bottom, setBottom] = useState('');
  const [activeMeme, setActiveMeme] = useState('tenguy');
  const [showResult, setShowResult] = useState(false);

  const processText = input => {
    return input
      .replace('_', '__')
      .replace('-', '--')
      .replace('?', '~q')
      .replace('%', '~p')
      .replace('#', '~h')
      .replace('/', '~s')
      .replace('"', "''")
      .replace(' ', '_');
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => setActiveMeme(item.meme)}>
        <View style={styles.memeBlock}>
          <Image
            source={{uri: `http://memegen.link/${item.meme}/_.jpg?preview=true&height=50`}}
            style={styles.memeImage}
          />
          {activeMeme == item.meme ? (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderWidth: 5,
                borderColor: '#ff0',
              }}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center", height: 50}}>
        <Icon
          source="arrow-left"
          // color={MD3Colors.error50}
          size={20}
        />
        <Image
          source={require('../../../../assets/onboarding/header.png')}
          resizeMode={'contain'}
          style={{width: "90%", height: 80}}
        />
      </View> */}
      <View style={{marginVertical: '5%'}}>
        <TextInput
          style={styles.input}
          value={top}
          onChangeText={setTop}
          placeholder={'Input top text here'}
        />
        <TextInput
          style={styles.input}
          value={bottom}
          onChangeText={setBottom}
          placeholder={'Input bottom text here'}
        />
      </View>
      <FlatList
        data={MEMELIST}
        renderItem={renderItem}
        numColumns={3}
        keyExtractor={item => item.id.toString()}
      />

      <Button
      disabled={!top && !bottom}
        onPress={() => setShowResult(true)}
        mode="contained"
        style={{margin: 15}}
        contentStyle={{padding: '3%'}}
        theme={{roundness: 20}}>
        🐶 Generate
      </Button>
      {showResult && (
        <ResultScreen
          top={processText(top)}
          bottom={processText(bottom)}
          meme={activeMeme}
          showResult={showResult}
          onToggleResult={() => setShowResult(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    margin: 10,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ddd',
    paddingHorizontal: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  memeBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    width: widthHalves,
    height: widthHalves,
  },
  memeImage: {
    width: widthHalves,
    height: widthHalves,
  },
});

export default HomeScreen;
