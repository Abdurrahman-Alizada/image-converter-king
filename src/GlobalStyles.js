import {Dimensions, StyleSheet} from 'react-native';

export const width = Dimensions.get('window').width;
export const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

export const COLORS = {
  primary: '#282534',
  white: '#fff',
  black: '#000',
  blackLight: '#282F3E',
  greyLight: '#888C94',
  grey: '#e0e4eb',
  red: '#D70F64',
  orange: '#F77A55',
  blueLight: '#4838D1',
  buttonBackground: '#1A2131',
  lightBackground :"#D9C9C9"
};

export const lightPalette = {
  primary :"#32a9d9",
  background: '#fff',
  blueBG: '#265AE8',
  textGray: '#3E3F41',
  cardBG: '#fff',
  greyLight: '#ECE7FE',
  grey: '#3E3F41',
  textRed: '#DD105E',
  yellow: '#FFAF4F',
  lightYellow: '#F5E493',
  purpleLight: '#62468d',
  grayBG: '#D9D9D9',
  buttonBackground: '#F2F2F3',
  iconButtonBackground: '#AB9DFF',
};

export const darkPalette = {
  background: '#212121',
  blueBG: '#265AE8',
  textGray: '#3E3F41',
  cardBG: '#3E3F41',
  textRed: '#DD105E',
  yellow: '#FFAF4F',
  purpleLight: '#AC8DAF',
  buttonBackground: '#AB9DFF',
  iconButtonBackground: '#F2F2F3',
  // accent :"#62468d",
};

export default styles;
